@"
---
title: DevHire
emoji: 💼
colorFrom: blue
colorTo: indigo
sdk: docker
pinned: false
---
"@ | Set-Content README.md

\# DevHire Architecture Engine



DevHire is an enterprise-grade backend recruitment automation platform built with \*\*FastAPI\*\*, \*\*SQLAlchemy\*\*, and \*\*PostgreSQL\*\*. Designed with clean coding principles, the engine provides an advanced structural baseline featuring centralized exception layers, comprehensive logging, role-based mock states, and a fully containerized test environment.



\---



\## 🛠️ Core Tech Stack \& Ecosystem



\* \*\*Backend Framework:\*\* FastAPI (Python 3.10)

\* \*\*Database Layer:\*\* PostgreSQL

\* \*\*ORM \& Data Mapping:\*\* SQLAlchemy (Declarative Mapping)

\* \*\*Package \& Environment Management:\*\* `uv` (Ultra-fast Python package installer)

\* \*\*Containerization:\*\* Docker \& Docker Compose

\* \*\*Testing Framework:\*\* Pytest (with full environment-isolated regression sweeps)



\---



\## 📈 Key System Features



\### 1. Centralized Exception Handling \& Security

\* Built-in dynamic global exception wrapper matching custom backend error definitions (`DevHireException`).

\* Automatically intercepts database anomalies and structural payload issues, responding with clean, standardized, and recruiter-visible JSON outputs:

&#x20; ```json

&#x20; {

&#x20;   "success": false,

&#x20;   "error\_type": "DevHireException",

&#x20;   "message": "Error details here"

&#x20; }





├── app/

│   ├── api/            # API Router definitions \& dependency injections (v1 endpoints)

│   ├── core/           # Security configurations, permissions, and app constants

│   ├── db/             # Centralized PostgreSQL session instantiations

│   ├── models/         # SQLAlchemy Relational Models (User, Job, Application, Profiles)

│   ├── schemas/        # Pydantic data validation/serialization layers

│   ├── services/       # Decoupled business logic modules

│   └── main.py         # Main system orchestration configuration entrypoint

├── tests/              # Full test execution catalog (auth, jobs, applications, profiles)

├── Dockerfile          # Production multi-stage container instruction file

└── docker-compose.yml  # Local multi-container deployment manager

# 🚀 DevHire Core Engine

DevHire is a high-performance, containerized asynchronous backend engine designed to automate hiring pipelines, resume parsing architectures, and applicant tracking. Built with enterprise-grade Python tooling, the platform enforces strict automated testing lines and secure isolated container dependencies.

---

## 🏗️ System Architecture

```mermaid
graph TD
    Client[Client / Frontend Request] -->|Port 7860/8000| Gateway[FastAPI API Gateway]
    
    subgraph Compute Layer [FastAPI Application Bubble]
        Gateway --> Router[Endpoints / API Routers]
        Router --> Auth[Jose JWT Security Middleware]
        Router --> Models[Pydantic Validation / SQLAlchemy Models]
    end

    subgraph Data Tier
        Models -->|SQLAlchemy ORM Connection Pool| DB[(PostgreSQL Relational DB)]
    end

    subgraph DevOps Pipeline [Continuous Integration]
        GitHub[GitHub Actions Runner] -->|Trigger on Push| Tool[Astral uv Package Sync]
        Tool --> Test[Pytest Execution Sweep]
    end