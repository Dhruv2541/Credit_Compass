# Title: Team Responsibilities & Collaboration Matrix - Credit Compass
* **Version**: v1.0.0
* **Purpose**: Define roles, daily deliverables, communication guidelines, and code review responsibilities for team members A, B, C, and D.
* **Author**: Team Credit Compass (A, B, C, D)
* **Last Updated**: 2026-07-17
* **Dependencies**: [ImplementationPlan.md](file:///c:/Users/DP/Documents/Programming Languages/Credt_Compass/Credit_Compass/docs/ImplementationPlan.md)
* **Related Documents**: [GitWorkflow.md](file:///c:/Users/DP/Documents/Programming Languages/Credt_Compass/Credit_Compass/docs/GitWorkflow.md)

---

## Table of Contents
1. [Core Team Roles Matrix](#core-team-roles-matrix)
2. [Detailed Developer Assignments](#detailed-developer-assignments)
   - [Member A (ML Engineer)](#member-a-ml-engineer)
   - [Member B (Backend Architect)](#member-b-backend-architect)
   - [Member C (Frontend Engineer)](#member-c-frontend-engineer)
   - [Member D (UX Designer & PM)](#member-d-ux-designer--pm)
3. [Daily Deliverables Roadmap](#daily-deliverables-roadmap)
4. [Communication & Sync Cadence](#communication--sync-cadence)
5. [Code Review Responsibilities](#code-review-responsibilities)
6. [Knowledge Sharing Protocols](#knowledge-sharing-protocols)
7. [Implementation Notes & Guidelines](#implementation-notes--guidelines)

---

## Core Team Roles Matrix

| Member | Primary Role | Secondary Role | Focus Areas |
|--------|--------------|----------------|-------------|
| **Member A** | Lead ML Engineer | API Developer | Data synthesis, model training, SHAP calculations. |
| **Member B** | Backend Architect | DB Administrator | FastAPI configuration, DB models, Auth handlers. |
| **Member C** | Frontend Developer | Visualization Specialist | React routing, Tailwind CSS views, Recharts. |
| **Member D** | UX Designer & PM | Pitch Coordinator | Design mockup cards, demo flows, presentation slides. |

---

## Detailed Developer Assignments

### Member A (ML Engineer)
- **Primary Focus**: Data modeling and model explainability.
- **Responsibilities**: Generates the synthetic datasets, trains the Logistic Regression model, creates the SHAP explanation wrappers, and writes tests for the model service layer.
- **Secondary role**: Helps write API handlers for the `/credit/predict` endpoint.

### Member B (Backend Architect)
- **Primary Focus**: API and database architecture.
- **Responsibilities**: Sets up the FastAPI server, defines SQLAlchemy schemas, implements password hashing and JWT token handlers, and writes test suites for authentication routes.
- **Secondary role**: Manages deployment settings on Render.

### Member C (Frontend Engineer)
- **Primary Focus**: User interface and client-side logic.
- **Responsibilities**: Initializes Vite, sets up Tailwind CSS, implements React routing, connects views to API endpoints using Axios, and integrates Recharts for data visualization.
- **Secondary role**: Assists in debugging mobile layouts and style issues.

### Member D (UX Designer & PM)
- **Primary Focus**: Product management and design compliance.
- **Responsibilities**: Creates UI mockups, designs the conversational advisor flows, designs presentation slides, and leads presentation practices.
- **Secondary role**: Ensures the persistent educational disclaimer is visible on all dashboard views.

---

## Daily Deliverables Roadmap

### Day 1 Deliverables
- **Member A**: Pre-trained model (`model.pkl`) trained on synthetic datasets.
- **Member B**: Working FastAPI server with signup, login, and database connections.
- **Member C**: React interface with login and signup pages connected to backend endpoints.
- **Member D**: Finished design mockups and structured slide layouts.

### Day 2 Deliverables
- **Member A**: Local SHAP explainer integrated into backend prediction services.
- **Member B**: Active conversational chat routes with risk classification logic.
- **Member C**: Responsive dashboard rendering credit gauge, SHAP list, and simulation charts.
- **Member D**: Slide deck with speaker assignments and initial draft notes.

### Day 3 Deliverables
- **Member A**: Complete API test suite and validation results.
- **Member B**: Backend deployed to Render with active SQLite tables.
- **Member C**: Deployed frontend hosted on GitHub Pages linked to the production API.
- **Member D**: Finalized presentation slides and demo walkthrough recording.

---

## Communication & Sync Cadence
- **Morning Standup (9:00 AM)**: 15-minute sync to discuss daily tasks and identify blockers.
- **Afternoon Sync (3:00 PM)**: 15-minute quick status check on features.
- **Evening Review (9:00 PM)**: Code integration review to merge dev branch commits into the main branch.

---

## Code Review Responsibilities
To ensure code quality and knowledge sharing, pull requests require reviews before merging:
- Backend and database code must be approved by **Member B**.
- ML and SHAP service files must be approved by **Member A**.
- Frontend pages and components must be approved by **Member C**.

---

## Knowledge Sharing Protocols
- **API Documentation**: Document all REST endpoints and payloads in [API_Documentation.md](file:///c:/Users/DP/Documents/Programming Languages/Credt_Compass/Credit_Compass/docs/API_Documentation.md) before writing code.
- **Slack/Discord Updates**: Post updates in the channel when key integrations are ready for testing (e.g., *"auth endpoints ready for frontend team"*).
- **Git Commits**: Write clear commit messages as defined in [GitWorkflow.md](file:///c:/Users/DP/Documents/Programming Languages/Credt_Compass/Credit_Compass/docs/GitWorkflow.md) to keep the team informed of changes.
