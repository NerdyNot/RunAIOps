import json
import logging
import re
import os
import uuid
from datetime import datetime
import time
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from utils.langchain_llm import get_llm
from utils.db import get_db_connection, DB_TYPE
from utils.redis_connection import get_redis_connection

logging.basicConfig(level=logging.INFO)

redis_conn = get_redis_connection()

# Define the prompt templates for different types of scripts
bash_template = PromptTemplate.from_template("""
You are a helpful assistant that converts natural language commands into Bash scripts. 
Make sure to provide a complete and executable Bash script. The script should only run on the local computer and must not include any remote commands or SSH instructions. Scripts Must Generated in English.

OS: {os_type}
Command: {command}
""")

powershell_template = PromptTemplate.from_template("""
You are a helpful assistant that converts natural language commands into PowerShell scripts. 
Make sure to provide a complete and executable PowerShell script. The script should only run on the local computer and must not include any remote commands or SSH instructions. Scripts Must Generated in English.

OS: {os_type}
Command: {command}
""")

interpret_template = PromptTemplate.from_template("""
You are a multilingual assistant. Your task is to summarize and explain the output and error from the command execution.
First, detect the language of the command text and then respond in the same language as the command. 
If the command text is in Korean, your response must be in Korean. If it is in another language, respond in that language.
Provide a simple interpretation of the output and error.

Command: {command_text}
Output: {output}
Error: {error}
""")

# Define the output parser
parser = StrOutputParser()

def extract_script_from_response(response_text: str, os_type: str) -> str:
    if os_type.lower() == 'windows':
        match = re.search(r"```powershell\s(.*?)\s```", response_text, re.DOTALL)
    elif os_type.lower() in ['linux', 'darwin']:
        match = re.search(r"```bash\s(.*?)\s```", response_text, re.DOTALL)
    else:
        raise ValueError("Invalid OS type. Please specify 'windows' or 'linux' or 'darwin'.")
    
    if match:
        script = match.group(1).strip()
        logging.info(f"Extracted Script: {script}")
        return script
    
    logging.warning("No code block found in the response. Returning the full response.")
    return response_text.strip()

def convert_natural_language_to_script(command_text: str, os_type: str) -> str:
    llm = get_llm()
    if not llm:
        raise ValueError("LLM configuration not set. Please set the configuration using the admin settings page.")

    if os_type.lower() == 'windows':
        prompt = powershell_template
    elif os_type.lower() in ['linux', 'darwin']:
        prompt = bash_template
    else:
        raise ValueError("Invalid OS type. Please specify 'windows' or 'linux' or 'darwin'.")

    input_data = {"command": command_text, "os_type": os_type}
    chain = prompt | llm
    response = chain.invoke(input_data)
    logging.info(f"LLM Response: {response}")

    script_code = parser.parse(response.content)
    logging.info(f"Extracted Script Code: {script_code}")

    clean_script = extract_script_from_response(script_code, os_type)
    
    return clean_script

def interpret_result(command_text: str, output: str, error: str) -> str:
    llm = get_llm()
    if not llm:
        raise ValueError("LLM configuration not set. Please set the configuration using the admin settings page.")
    
    input_data = {"command_text": command_text, "output": output, "error": error}
    chain = interpret_template | llm
    response = chain.invoke(input_data)
    logging.info(f"LLM Interpretation Response: {response}")
    
    summary = parser.parse(response.content).strip()
    logging.info(f"LLM Summary: {summary}")
    
    return summary

# Tool to find agent_id from message
def find_agent_id(message: str) -> str:
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        query = """
        SELECT agent_id FROM agents WHERE computer_name LIKE %s OR private_ip LIKE %s
        """ if DB_TYPE == 'mysql' else """
        SELECT agent_id FROM agents WHERE computer_name LIKE ? OR private_ip LIKE ?
        """
        cursor.execute(query, (f"%{message}%", f"%{message}%"))
        row = cursor.fetchone()
    finally:
        conn.close()

    if row:
        return row['agent_id']
    else:
        logging.warning("No matching agent found for the message.")
        return "No matching agent found"

# Tool to generate verification script
def generate_verification_script_tool(message: str) -> str:
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        query = """
        SELECT os_type FROM agents WHERE agent_id = %s
        """ if DB_TYPE == 'mysql' else """
        SELECT os_type FROM agents WHERE agent_id = ?
        """
        cursor.execute(query, (message,))
        row = cursor.fetchone()
    finally:
        conn.close()

    if not row:
        return "Agent not found in the database."

    os_type = row['os_type']
    verification_command = f"Alert Message: {message}. Please generate a script to verify this message on the local computer."
    return convert_natural_language_to_script(verification_command, os_type)

def execute_script_and_get_result(agent_id: str, script: str) -> str:
    redis_conn = get_redis_connection()
    task_id = str(uuid.uuid4())
    task_data = {
        "task_id": task_id,
        "input": script,
        "script_code": script,
        "agent_id": agent_id,
        "timestamp": datetime.now().isoformat(),
        "status": "approved",
        "approved_at": datetime.now().isoformat(),
    }

    # Add the task to the agent's task queue in Redis
    redis_conn.set(f'task:{task_id}', json.dumps(task_data))
    redis_conn.lpush(f'task_queue:{agent_id}', json.dumps(task_data))

    # Wait for the agent to execute the task and return the result
    result_key = f"result:{task_id}"
    for _ in range(10):  # Retry 10 times with a delay
        result = redis_conn.hgetall(result_key)
        if result:
            output = result.get(b'output', b'').decode()
            error = result.get(b'error', b'').decode()
            interpretation = result.get(b'interpretation', b'').decode()
            return {
                "output": output,
                "error": error,
                "interpretation": interpretation,
            }
        time.sleep(5)  # Wait for 5 seconds before retrying

    return "No response from agent"