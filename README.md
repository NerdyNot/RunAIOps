## Overview

The `NerdyOps` project is an advanced remote operations platform that leverages LangChain to automate the execution of scripts on remote Linux and Windows servers. LangChain's integration with large language models (LLMs) allows the system to transform natural language commands into executable scripts, distribute tasks to agents, execute them remotely, and interpret the results back into human-readable summaries.

This repository includes the following key components:
1. **Frontend**: A web-based user interface that allows users to submit commands, monitor task execution, and view results.
2. **Backend**: A Flask-based server that manages task distribution to agents, handles agent registrations, and utilizes LangChain to convert and interpret commands.
3. **Agents**:
    - **Go Agent**: A Go-based agent that communicates with the central server, retrieves tasks, executes them, and reports the results.
    - **Python Agent**: A Python-based agent that performs similar functions to the Go Agent, using Python's robust capabilities.

### Repository Structure

```
NerdyOps/
├── frontend/                # Frontend web application
│   ├── public/              # Static assets
│   ├── src/                 # Source code
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components
│
├── backend/
│   ├── app.py               # Main Flask application for the central server
│   ├── auth.py              # Manages user authentication functionalities
│   ├── db.py                # Manages SQLite database connections and initializations
│   ├── langchain_integration.py # Integrates LangChain for command conversion and result interpretation
│   ├── redis_connection.py  # Handles connections to the Redis server
│   └── config.py            # Contains configuration settings for Redis
├── agent/
│   ├── go_agent/
│   │   ├── main.go          # Main Go application for the Go agent
│   ├── python_agent/
│   │   ├── agent.py         # Main Python application for the Python agent
└── README.md                # This README file

```

## Frontend

The frontend of `NerdyOps` is a web-based application built using React.js. It provides users with an intuitive interface to interact with the system, submit commands, monitor task execution progress, and view task results.

- **User Interface**: The frontend includes various components and pages designed to facilitate user interactions.
- **Task Submission**: Users can submit natural language commands via input fields or forms.
- **Task Monitoring**: Users can track the progress of tasks submitted, including their status (pending, in progress, completed).
- **Results Display**: Once tasks are executed by agents, users can view human-readable summaries and detailed results.
- **Integration**: The frontend interacts with the backend server via RESTful APIs to submit commands and retrieve task information.

## Backend

The central server acts as the command center, coordinating tasks between the user and the agents. It performs the following critical functions:

- **Task Submission**: Users submit natural language commands. The server uses LangChain to convert these commands into scripts suitable for the target OS (Linux or Windows).
- **Agent Registration**: Agents register themselves with the server and continuously update their status.
- **Task Management**: The server maintains task queues for each agent, which agents can fetch and execute.
- **Result Interpretation**: The server uses LangChain to interpret the results of task execution into human-readable summaries.

**Key Technologies**: Python, Flask, SQLite, Redis, LangChain

### Backend Files

- **app.py**: The main Flask application for the central server.
- **auth.py**: Manages user authentication functionalities including signup, login, and token validation within the NerdyOps project.
- **db.py**: Manages SQLite database connections and initializations.
- **langchain_integration.py**: Integrates LangChain to convert natural language commands into scripts and interpret execution results.
- **redis_connection.py**: Handles connections to the Redis server.
- **config.py**: Contains configuration settings for Redis.

## Agents

Agents are deployed on remote servers to execute tasks received from the central server.

### Go Agent

The Go Agent is a lightweight client written in Go, designed to register with the central server, fetch tasks, execute them, and report the results back efficiently.

**Key Technologies**: Go, HTTP, REST API

**Main Files**:

- **main.go**: Core logic of the Go agent, including registration, task fetching, execution, and result reporting.

### Python Agent

The Python Agent is a versatile client written in Python, mirroring the functionalities of the Go Agent. It is ideal for environments where Python's flexibility and libraries are required.

**Key Technologies**: Python, Requests, Subprocess, REST API

**Main Files**:

- **agent.py**: Core logic of the Python agent, handling registration, task fetching, execution, and result reporting.

## Getting Started

### Prerequisites

- **Python 3.8+**
- **Go 1.16+**
- **Redis**
- **SQLite**
- **LangChain**
- **OpenAI or Azure OpenAI API key**

### Setup Instructions

1. **Clone the Repository**:
    
    ```
    git clone <https://github.com/NerdyNot/NerdyOps.git>
    cd NerdyOps
    ```
    
2. **Central Server Setup**:
    - Navigate to the `central_server` directory.
    - Create and activate a Python virtual environment.
    - Install the required Python packages.
    - Start the central server using `python app.py`.
    
    ```
    cd central_server
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\\Scripts\\activate`
    pip install -r requirements.txt
    python app.py
    
    ```
    
3. **Go Agent Setup**:
    - Navigate to the `go_agent` directory.
    - Build and run the Go agent.
    
    ```
    cd ../agent/go_agent
    go build -o agent main.go
    ./agent
    
    ```
    
4. **Python Agent Setup**:
    - Navigate to the `python_agent` directory.
    - Create and activate a Python virtual environment.
    - Install the required Python packages.
    - Start the Python agent using `python agent.py`.
    
    ```
    cd ../python_agent
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\\Scripts\\activate`
    pip install -r requirements.txt
    python agent.py
    
    ```
    

## Usage

1. **Submit a Task**:
    - Use the Streamlit app or the API to submit a task to the central server.
2. **Task Execution**:
    - Agents fetch tasks from the central server, execute them, and report results back.
3. **Monitor Status**:
    - Use the Streamlit app or API endpoints to monitor the status of agents and tasks.

### Important Notices

1. **Script Execution**
    - The agent executes scripts provided by the central server. Ensure that scripts are carefully reviewed to prevent unintended actions.
2. **User Responsibility**
    - The use of this software is at the user's own risk.
    - The developers are not responsible for any damages or losses that may occur from the use of this software.
    - It is the user's responsibility to ensure that the commands and scripts executed by this tool are appropriate and safe for their environment.


## Contributing

Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 개요

`NerdyOps` 프로젝트는 LangChain을 활용하여 원격 Linux 및 Windows 서버에서 스크립트 실행을 자동화하는 고급 원격 운영 플랫폼입니다. LangChain과 대형 언어 모델(LLM)의 통합을 통해 시스템은 자연어 명령을 실행 가능한 스크립트로 변환하고, 작업을 에이전트에 분배하며, 원격으로 이를 실행하고 실행 결과를 사람이 읽을 수 있는 요약으로 해석할 수 있습니다.

이 리포지토리에는 다음과 같은 주요 구성 요소가 포함되어 있습니다:

1. **프론트엔드**: React.js를 사용하여 구축된 웹 기반 응용 프로그램으로, 사용자에게 시스템과 상호 작용할 직관적 인터페이스를 제공합니다. 명령을 제출하고 작업 실행 상황을 모니터링하며 작업 결과를 확인할 수 있습니다.
2. **백엔드**: Flask 기반의 서버로, 작업 분배를 관리하고 에이전트 등록을 처리하며, LangChain을 사용하여 명령을 변환하고 해석합니다.
3. **에이전트**:
    - **Go 에이전트**: 중앙 서버와 통신하고, 작업을 가져와 실행하며, 결과를 보고하는 경량 Go 클라이언트.
    - **Python 에이전트**: Python으로 작성된 다목적 클라이언트로, Go 에이전트와 유사한 기능을 제공합니다. Python의 유연성과 라이브러리를 활용합니다.

### 리포지토리 구조

```
NerdyOps/
├── frontend/                # 프론트엔드 웹 애플리케이션
│   ├── public/              # 정적 자산
│   ├── src/                 # 소스 코드
│   │   ├── components/      # 재사용 가능한 React 컴포넌트
│   │   ├── pages/           # 페이지 컴포넌트
│
├── backend/
│   ├── app.py               # 중앙 서버의 메인 Flask 애플리케이션
│   ├── auth.py              # 사용자 인증 기능 관리
│   ├── db.py                # SQLite 데이터베이스 연결 및 초기화 관리
│   ├── langchain_integration.py # LangChain을 통한 명령 변환 및 실행 결과 해석 통합
│   ├── redis_connection.py  # Redis 서버 연결 관리
│   └── config.py            # Redis 설정 관리
├── agent/
│   ├── go_agent/
│   │   ├── main.go          # Go 에이전트의 주요 애플리케이션
│   ├── python_agent/
│   │   ├── agent.py         # Python 에이전트의 주요 애플리케이션
└── README.md                # 이 README 파일
```

## 프론트엔드

`NerdyOps`의 프론트엔드는 React.js를 사용하여 구축된 웹 기반 응용 프로그램입니다. 사용자에게 시스템과 상호 작용할 직관적 인터페이스를 제공하여 명령을 제출하고, 작업 실행 상황을 모니터링하며, 작업 결과를 확인할 수 있습니다.

- **사용자 인터페이스**: 프론트엔드에는 사용자 상호 작용을 용이하게 하는 다양한 컴포넌트와 페이지가 포함되어 있습니다.
- **작업 제출**: 사용자는 입력 필드나 폼을 통해 자연어 명령을 제출할 수 있습니다.
- **작업 모니터링**: 사용자는 제출된 작업의 진행 상황을 추적할 수 있으며, 상태(대기 중, 진행 중, 완료)를 확인할 수 있습니다.
- **결과 표시**: 에이전트가 작업을 실행한 후 사용자는 사람이 읽을 수 있는 요약 및 상세 결과를 확인할 수 있습니다.
- **통합**: 프론트엔드는 RESTful API를 통해 백엔드 서버와 상호 작용하여 명령을 제출하고 작업 정보를 검색합니다.

## 백엔드

중앙 서버는 사용자와 에이전트 간의 명령 및 작업을 조정하는 중심 역할을 수행합니다. 주요 기능은 다음과 같습니다:

- **작업 제출**: 사용자가 자연어 명령을 제출하면, 서버는 LangChain을 사용하여 이 명령을 대상 운영 체제(Linux 또는 Windows)에 적합한 스크립트로 변환합니다.
- **에이전트 등록**: 에이전트는 서버에 등록하고 지속적으로 상태를 업데이트합니다.
- **작업 관리**: 서버는 각 에이전트의 작업 큐를 유지하며, 에이전트가 이를 가져와 실행할 수 있습니다.
- **결과 해석**: 서버는 작업 실행 결과를 LangChain을 사용하여 사람에게 읽기 쉬운 요약으로 해석합니다.

**주요 기술**: Python, Flask, SQLite, Redis, LangChain

### 중앙 서버 파일

- **app.py**: 중앙 서버의 메인 Flask 애플리케이션.
- **auth.py** : NerdyOps 프로젝트 내에서 회원 가입, 로그인, 토큰 유효성 검사 등 사용자 인증 기능을 관리합니다.
- **db.py**: SQLite 데이터베이스 연결 및 초기화를 관리합니다.
- **langchain_integration.py**: LangChain을 통합하여 자연어 명령을 스크립트로 변환하고, 실행 결과를 해석합니다.
- **redis_connection.py**: Redis 서버와의 연결을 처리합니다.
- **config.py**: Redis 구성 설정을 포함합니다.

## 에이전트

에이전트는 원격 서버에 배포되어 중앙 서버에서 받은 작업을 실행하는 역할을 합니다.

### Go 에이전트

Go 에이전트는 중앙 서버에 등록하고, 작업을 가져와 실행하며, 결과를 효율적으로 보고하는 Go로 작성된 경량 클라이언트입니다.

**주요 기술**: Go, HTTP, REST API

**주요 파일**:

- **main.go**: Go 에이전트의 핵심 로직으로, 등록, 작업 가져오기, 실행, 결과 보고를 포함합니다.
- **logo.go**: Go 에이전트 시작 시 ASCII 로고를 표시합니다.

### Python 에이전트

Python 에이전트는 Python으로 작성된 유연한 클라이언트로, Go 에이전트와 유사한 기능을 제공합니다. Python의 유연성과 라이브러리를 활용하기에 적합합니다.

**주요 기술**: Python, Requests, Subprocess, REST API

**주요 파일**:

- **agent.py**: Python 에이전트의 핵심 로직으로, 등록, 작업 가져오기, 실행, 결과 보고를 처리합니다.
- **logo.py**: Python 에이전트 시작 시 ASCII 로고를 표시합니다.

## 시작하기

### 사전 요구 사항

- **Python 3.8+**
- **Go 1.16+**
- **Redis**
- **SQLite**
- **LangChain**
- **OpenAI 또는 Azure OpenAI API 키**

### 설정 지침

1. **리포지토리 클론**:
    
    ```
    git clone <https://github.com/NerdyNot/NerdyOps.git>
    cd NerdyOps
    
    ```
    
2. **중앙 서버 설정**:
    - `central_server` 디렉토리로 이동합니다.
    - Python 가상 환경을 생성하고 활성화합니다.
    - 필요한 Python 패키지를 설치합니다.
    - `python app.py`를 사용하여 중앙 서버를 시작합니다.
    
    ```
    cd central_server
    python -m venv venv
    source venv/bin/activate  # Windows에서는 `venv\\Scripts\\activate` 사용
    pip install -r requirements.txt
    python app.py
    
    ```
    
3. **Go 에이전트 설정**:
    - `go_agent` 디렉토리로 이동합니다.
    - Go 에이전트를 빌드하고 실행합니다.
    
    ```
    cd ../agent/go_agent
    go build -o agent main.go
    ./agent
    
    ```
    
4. **Python 에이전트 설정**:
    - `python_agent` 디렉토리로 이동합니다.
    - Python 가상 환경을 생성하고 활성화합니다.
    - 필요한 Python 패키지를 설치합니다.
    - `python agent.py`를 사용하여 Python 에이전트를 시작합니다.
    
    ```
    cd ../python_agent
    python -m venv venv
    source venv/bin/activate  # Windows에서는 `venv\\Scripts\\activate` 사용
    pip install -r requirements.txt
    python agent.py
    
    ```
    

## 사용법

1. **작업 제출**:
    - Streamlit 앱이나 API를 사용하여 중앙 서버에 작업을 제출합니다.
2. **작업 실행**:
    - 에이전트가 중앙 서버에서 작업을 가져와 이를 실행하고 결과를 보고합니다.
3. **상태 모니터링**:
    - Streamlit 앱이나 API 엔드포인트를 사용하여 에이전트와 작업의 상태를 모니터링합니다.

### 주의
1. **스크립트 실행**
    - 에이전트는 중앙 서버에서 제공하는 스크립트를 실행합니다. 스크립트를 주의 깊게 검토하여 의도하지 않은 작업이 실행되지 않도록 하세요.
2. **사용자 책임**
    - 이 소프트웨어의 사용은 사용자의 책임입니다.
    - 이 소프트웨어 사용으로 인한 어떠한 손해나 손실에 대해 개발자는 책임지지 않습니다.
    - 이 도구로 실행되는 명령과 스크립트가 적절하고 안전한지 확인하는 것은 사용자의 책임입니다.

## 기여

개선 사항이나 버그 수정을 위한 이슈를 열거나 풀 리퀘스트를 제출해 주세요.

## 라이센스

이 프로젝트는 MIT 라이센스를 따릅니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하십시오.