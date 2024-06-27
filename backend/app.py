# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from utils.redis_connection import get_redis_connection
from utils.db import init_db, get_db_connection
from utils.logo import print_logo
from endpoints.auth import auth_bp
from endpoints.tasks import tasks_bp
from endpoints.monitoring import monitoring_bp
from endpoints.pat import pat_bp
from endpoints.agent import agent_bp, schedule_agent_status_check
import json
import logging

logging.basicConfig(level=logging.INFO)

app = Flask(__name__)
CORS(app)

redis = get_redis_connection()

db_initialized = False

app.register_blueprint(auth_bp)
app.register_blueprint(tasks_bp)
app.register_blueprint(monitoring_bp)
app.register_blueprint(pat_bp)
app.register_blueprint(agent_bp)

@app.before_request
def initialize_database():
    global db_initialized
    if not db_initialized:
        init_db()
        db_initialized = True

@app.route('/health', methods=['GET'])
def ping():
    return jsonify({"status": "ok"}), 200

# Main entry point for the application
if __name__ == '__main__':
    print_logo()
    init_db()
    schedule_agent_status_check()
    app.run(host='0.0.0.0', port=5001)
