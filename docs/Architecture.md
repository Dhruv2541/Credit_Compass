# Title: Architecture Specification - Credit Compass
* **Version**: v1.0.0
* **Purpose**: Technical architecture mapping out system components, data sequences, model pipelines, and deployment structures.
* **Author**: Team Credit Compass (A, B, C, D)
* **Last Updated**: 2026-07-17
* **Dependencies**: [TechSpec.md](file:///c:/Users/DP/Documents/Programming Languages/Credt_Compass/Credit_Compass/docs/TechSpec.md)
* **Related Documents**: [Schema.md](file:///c:/Users/DP/Documents/Programming Languages/Credt_Compass/Credit_Compass/docs/Schema.md), [API_Documentation.md](file:///c:/Users/DP/Documents/Programming Languages/Credt_Compass/Credit_Compass/docs/API_Documentation.md)

---

## Table of Contents
1. [High-Level Architecture (C4 Model Context)](#high-level-architecture-c4-model-context)
2. [Container Architecture](#container-architecture)
3. [Component Architectures](#component-architectures)
   - [Backend Component Diagram](#backend-component-diagram)
   - [Frontend Component Diagram](#frontend-component-diagram)
4. [Sequence & Process Flows](#sequence--process-flows)
   - [Authentication Protocol Sequence](#authentication-protocol-sequence)
   - [AI Inference & SHAP Flow Sequence](#ai-inference--shap-flow-sequence)
   - [Conversational Advisor Sequence](#conversational-advisor-sequence)
5. [Machine Learning Pipeline Flow](#machine-learning-pipeline-flow)
6. [Deployment Architecture](#deployment-architecture-1)
7. [Implementation Notes & Assumptions](#implementation-notes--assumptions)

---

## High-Level Architecture (C4 Model Context)
The overall system separates client-side rendering from core server resources.

```mermaid
graph TD
    User[User / First-time Investor] -->|Interacts with| FE[React Frontend SPA]
    FE -->|Requests API| BE[FastAPI Backend Gateway]
    BE -->|Writes/Reads| DB[(SQLite Database)]
    BE -->|Loads Model| ML[Logistic Regression Model & SHAP Explainer]
```

---

## Container Architecture
- **Web App (React/Vite)**: Deployed to GitHub Pages. Executes in the user's browser, handles state management, and renders dashboards.
- **REST API (FastAPI)**: Running as an asynchronous service on Render. Receives requests, verifies JWT tokens, queries the database, and processes models.
- **Database (SQLite)**: File-based relational database stored on Render. Holds records for users, signals, predictions, and portfolios.

---

## Component Architectures

### Backend Component Diagram
FastAPI manages routing, dependencies, and connections.

```mermaid
graph TD
    Router[API Router: Main] --> Auth[Auth Controller]
    Router --> Credit[Credit Controller]
    Router --> Invest[Investment Controller]
    
    Credit --> MLServ[Credit Service - SHAP]
    Invest --> InvestServ[Investment Service]
    
    Auth --> Session[SQLAlchemy Session Helper]
    Credit --> Session
    Invest --> Session
    
    Session --> DB[(SQLite File)]
```

### Frontend Component Diagram
React handles route protection and data rendering.

```mermaid
graph TD
    App[App Container] --> AuthContext[Auth Context State]
    App --> Router[React Router]
    
    Router --> Login[Login View]
    Router --> Signup[Signup View]
    Router --> Dashboard[Protected Dashboard]
    Router --> Advisor[Protected Advisor]
    
    Dashboard --> Gauge[Credit Score Gauge]
    Dashboard --> SHAPList[SHAP Feature List]
    
    Advisor --> ChatBubble[Chat Console Interface]
    Advisor --> CompLine[Compounding Line Graph]
```

---

## Sequence & Process Flows

### Authentication Protocol Sequence

```mermaid
sequenceDiagram
    participant Client as React Client (Browser)
    participant Server as FastAPI Auth Router
    participant DB as SQLite DB
    
    Client->>Server: POST /auth/login (credentials)
    Server->>DB: Fetch user password hash
    DB-->>Server: Password hash record
    Server->>Server: Hash comparison check
    Server-->>Client: 200 OK + JWT Token
```

### AI Inference & SHAP Flow Sequence

```mermaid
sequenceDiagram
    participant Client as React Dashboard
    participant Server as FastAPI Credit Router
    participant Serv as Credit Service
    participant Model as Scikit-Learn (model.pkl)
    participant SHAP as SHAP Explainer
    participant DB as SQLite DB
    
    Client->>Server: POST /credit/predict (signals) + JWT Header
    Server->>Server: Verify Token
    Server->>Serv: Run inference pipeline (signals)
    Serv->>Model: Execute predict_proba()
    Model-->>Serv: Classification Probability
    Serv->>SHAP: Calculate SHAP linear explanations
    SHAP-->>Serv: SHAP values per feature
    Serv->>DB: Save prediction record
    Serv-->>Server: Score (300-850) + SHAP impact metrics
    Server-->>Client: Returns JSON payloads
```

### Conversational Advisor Sequence

```mermaid
sequenceDiagram
    participant Client as React Chat Console
    participant Server as FastAPI Investment Router
    participant DB as SQLite DB
    
    Client->>Server: GET /investment/chat/status
    Server->>DB: Fetch user progress
    DB-->>Server: Current state record
    Server-->>Client: Return next question options
    Client->>Server: POST /investment/chat/message (response)
    Server->>DB: Save question answer & update progress
    Server-->>Client: Return next question or risk classification
```

---

## Machine Learning Pipeline Flow
1. **Inputs**: Users submit five alternative financial signals via the dashboard.
2. **Preprocessing**: The inputs are formatted into feature vectors and scaled using a standard scaler.
3. **Inference**: The pre-trained Logistic Regression model calculates default likelihood probabilities.
4. **SHAP Analysis**: The model computes Shapley values, scales them, and maps the top features to human-readable explanations.

---

## Deployment Architecture

```mermaid
graph TD
    source[GitHub Repository] -->|Actions Trigger| BuildFE[Build Static Frontend]
    source -->|Actions Trigger| DeployBE[Build Python App Image]
    
    BuildFE -->|Publish| GHP[GitHub Pages CDN]
    DeployBE -->|Deploy Service| Render[Render Web Service]
    
    Render -->|Writes| SQLiteDB[(SQLite Persistent Storage)]
```

---

## Implementation Notes & Assumptions
- **Scaling considerations**: Transitioning to PostgreSQL in later phases is straightforward because the database layer is abstracted using SQLAlchemy models.
- **Render Limits**: Render's free tier spins down after periods of inactivity. The React client handles this by showing a loading spinner when waking up backend services.
- **Model Storage**: The model file (`model.pkl`) is stored in the Git repository to simplify and speed up deployments.
