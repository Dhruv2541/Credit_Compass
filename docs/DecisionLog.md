# Title: Architecture Decision Log - Credit Compass
* **Version**: v1.0.0
* **Purpose**: Record key architectural decisions, design choices, evaluated alternatives, and engineering rationales.
* **Author**: Team Credit Compass (A, B, C, D)
* **Last Updated**: 2026-07-17
* **Dependencies**: [TechSpec.md](file:///c:/Users/DP/Documents/Programming Languages/Credt_Compass/Credit_Compass/docs/TechSpec.md)
* **Related Documents**: [README.md](file:///c:/Users/DP/Documents/Programming Languages/Credt_Compass/Credit_Compass/docs/README.md), [FutureEnhancements.md](file:///c:/Users/DP/Documents/Programming Languages/Credt_Compass/Credit_Compass/docs/FutureEnhancements.md)

---

## Table of Contents
1. [ADR-01: SQLite as the Initial Relational Database](#adr-01-sqlite-as-the-initial-relational-database)
2. [ADR-02: FastAPI for the Python Backend API](#adr-02-fastapi-for-the-python-backend-api)
3. [ADR-03: React SPA with Tailwind CSS & Vite](#adr-03-react-spa-with-tailwind-css--vite)
4. [ADR-04: SHAP Explainer for Model Explainability](#adr-04-shap-explainer-for-model-explainability)
5. [ADR-05: JWT-based Token Authentication](#adr-05-jwt-based-token-authentication)
6. [Implementation Notes & Review Cadence](#implementation-notes--review-cadence)

---

## ADR-01: SQLite as the Initial Relational Database

### Context & Problem Statement
The application requires a database to store user records, alternative signals, prediction histories, and portfolios during the 72-hour hackathon.

### Evaluated Options
1. **SQLite**: File-based relational database.
2. **PostgreSQL**: Server-based relational database.

### Decision & Rationale
We chose **SQLite** for the initial database.
- **Why**: SQLite is lightweight and requires no external server setup, which simplifies local development and reduces deployment complexity during the hackathon. Using SQLAlchemy allows us to transition to PostgreSQL in future phases if needed without refactoring our queries.

---

## ADR-02: FastAPI for the Python Backend API

### Context & Problem Statement
We need a web framework to build our REST APIs and serve model predictions to the client.

### Evaluated Options
1. **FastAPI**: Modern, asynchronous Python web framework.
2. **Django**: Full-featured Python framework.
3. **Flask**: Lightweight WSGI framework.

### Decision & Rationale
We chose **FastAPI**.
- **Why**: FastAPI offers built-in async support, automatic API documentation, and fast performance. It integrates with Pydantic for request validation and simplifies importing and running Python ML libraries like Scikit-Learn.

---

## ADR-03: React SPA with Tailwind CSS & Vite

### Context & Problem Statement
We need a frontend framework to build an interactive, responsive dashboard for Credit Compass.

### Evaluated Options
1. **React with Vite & Tailwind CSS**: Modern frontend stack.
2. **Next.js**: Server-side rendered React framework.

### Decision & Rationale
We chose **React with Vite & Tailwind CSS**.
- **Why**: Vite provides fast build times and hot module replacement, and Tailwind CSS makes it easy to build responsive, customized dark-theme interfaces. An SPA structure allows us to deploy the frontend statically to GitHub Pages, reducing deployment costs.

---

## ADR-04: SHAP Explainer for Model Explainability

### Context & Problem Statement
To make credit assessments transparent, the application must explain the factors influencing the model's predictions.

### Evaluated Options
1. **SHAP (Shapley Additive Explanations)**: Game-theoretic approach to feature attribution.
2. **LIME (Local Interpretable Model-agnostic Explanations)**: Local surrogate model approach.

### Decision & Rationale
We chose **SHAP**.
- **Why**: SHAP provides mathematically consistent and localized feature attributions. It calculates exact feature impacts for each prediction, which helps us explain the score to the user clearly.

---

## ADR-05: JWT-based Token Authentication

### Context & Problem Statement
We need a secure mechanism to authenticate user sessions and protect API routes.

### Evaluated Options
1. **JWT (JSON Web Tokens)**: Stateless token-based auth.
2. **Session Cookies**: State-based session tracking.

### Decision & Rationale
We chose **JWT-based Token Authentication**.
- **Why**: JWTs are stateless and self-contained, which eliminates the need to store session records on the server. The client stores the token in local memory, which works well with our decoupled frontend and backend deployments.

---

## Implementation Notes & Review Cadence
- **Reviewing Decisions**: These decisions are reviewed by the team if new requirements emerge (e.g., if concurrent database writes exceed SQLite's capabilities).
- **ADR Updates**: Document any changes to our architectural decisions in this log.
