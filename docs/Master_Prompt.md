# Title: AI Developer Master Prompt - Credit Compass
* **Version**: v1.0.0
* **Purpose**: Developer instruction set enabling downstream AI coding assistants to build, test, and polish the Credit Compass platform.
* **Author**: Team Credit Compass (A, B, C, D)
* **Last Updated**: 2026-07-17
* **Dependencies**: [TechSpec.md](file:///c:/Users/DP/Documents/Programming Languages/Credt_Compass/Credit_Compass/docs/TechSpec.md)
* **Related Documents**: [CodingStandards.md](file:///c:/Users/DP/Documents/Programming Languages/Credt_Compass/Credit_Compass/docs/CodingStandards.md), [FolderStructure.md](file:///c:/Users/DP/Documents/Programming Languages/Credt_Compass/Credit_Compass/docs/FolderStructure.md)

---

## Table of Contents
1. [Role & Directives](#role--directives)
2. [Target Architecture & Tech Stack](#target-architecture--tech-stack)
3. [Repository Folder Structure Blueprint](#repository-folder-structure-blueprint)
4. [Coding Rules & Standards](#coding-rules--standards)
   - [Python & FastAPI Standards](#python--fastapi-standards)
   - [React & Vite Standards](#react--vite-standards)
   - [Tailwind CSS Design Tokens](#tailwind-css-design-tokens)
5. [Database & SQL Rules](#database--sql-rules)
6. [Machine Learning & SHAP Rules](#machine-learning--shap-rules)
7. [API Design & Error Guidelines](#api-design--error-guidelines)
8. [Security & Hashing Rules](#security--hashing-rules)
9. [Performance Targets](#performance-targets)
10. [Testing & Verification Specifications](#testing--verification-specifications)
11. [Git Workflow & Commitment Rules](#git-workflow--commitment-rules)
12. [Sample Execution Commands](#sample-execution-commands)

---

## Role & Directives
You are a Principal Software Engineer building **Credit Compass**—a transparent alternative credit scoring and micro-investment simulator.
- **Goal**: Write clean, modular, and typed code.
- **Rule**: Avoid adding placeholders or TODO comments. Write complete, functional code blocks.
- **Styling directive**: Build a high-fidelity dark UI themed with glassmorphism.

---

## Target Architecture & Tech Stack
- **Frontend**: React (Vite), React Router DOM (protected pages), Tailwind CSS, Axios, and Recharts.
- **Backend**: FastAPI (Python), SQLAlchemy ORM, SQLite database.
- **Authentication**: JWT authentication with SHA-256 tokens and bcrypt-hashed passwords.
- **Machine Learning**: Scikit-Learn `LogisticRegression` and SHAP explainability.

---

## Repository Folder Structure Blueprint
Ensure all code files align with this structure:
- `/backend/app/api`: Router files (`auth.py`, `credit.py`, `invest.py`).
- `/backend/app/services`: Business services (`credit_service.py`, `invest_service.py`).
- `/backend/app/models`: SQLAlchemy schemas (`models.py`).
- `/backend/app/schemas`: Pydantic validations (`schemas.py`).
- `/frontend/src/components`: UI structures (`ui/`, `charts/`, `layout/`).
- `/frontend/src/pages`: Routed screens (`Login.jsx`, `Signup.jsx`, `Dashboard.jsx`, `Advisor.jsx`).
- `/scripts`: Setup scripts (`generate_data.py`, `train_model.py`).

---

## Coding Rules & Standards

### Python & FastAPI Standards
- Follow **PEP 8** style guidelines.
- Always include type hints for function arguments and return signatures:
  ```python
  def compute_growth(initial: float, rate: float) -> list[float]:
  ```
- Use FastAPI dependencies (`Depends`) to inject database sessions and verify JWT authentications.

### React & Vite Standards
- Use functional components and custom hooks to manage state.
- Handle state locally where possible, and use React Context for global auth state.
- Keep components focused and modular.
- Always handle promise rejections explicitly using `try/catch` wrappers.

### Tailwind CSS Design Tokens
- Style components using the dark-theme configuration:
  - Background color: `bg-[#0b0f19]`
  - Cards: `bg-[#121826]/60 backdrop-blur-md border border-white/5`
  - Green Accent: `emerald-500`
  - Cyan Accent: `cyan-500`
  - Red Accent: `rose-500`
- Ensure all interactive elements include transition styles (`transition-all duration-300`).

---

## Database & SQL Rules
- Ensure model names align with SQLAlchemy representations in [Schema.md](file:///c:/Users/DP/Documents/Programming Languages/Credt_Compass/Credit_Compass/docs/Schema.md).
- Keep SQLite write transactions fast to prevent locking errors.
- Always write safe queries with parameterized inputs to protect against SQL injections.

---

## Machine Learning & SHAP Rules
- Load `model.pkl` on application startup and cache the model object in memory to prevent reload delays.
- Use `shap.LinearExplainer` to extract individual feature contributions.
- Scale raw inputs using `StandardScaler` transformations before running model predictions.
- Map SHAP features to human-readable explanations before returning them to the client.

---

## API Design & Error Guidelines
- Ensure all API endpoints are sub-routes of `/api/v1`.
- Return error responses using standard JSON structures:
  ```json
  {
    "detail": "Actionable error explanation",
    "error_code": "SPECIFIC_ERROR_ENUM"
  }
  ```
- Use standard HTTP status codes (`200` for success, `400` for invalid inputs, `401` for auth errors).

---

## Security & Hashing Rules
- Hash user passwords using `bcrypt` (rounds: 12).
- Set JWT expiration limits to 24 hours.
- Inject CORS headers to allow requests only from trusted client origins.

---

## Performance Targets
- Keep ML API response latencies below 300ms.
- Optimize React bundle sizes using lazy loading.
- Enable index scans on SQL queries using foreign key indexes.

---

## Testing & Verification Specifications
- Write pytest suites for the backend.
- Mock external dependencies to keep tests isolated.
- Aim for a minimum of 80% test coverage across core service files.

---

## Git Workflow & Commitment Rules
- Write semantic commit messages (`feat: ...`, `fix: ...`, `docs: ...`).
- Work on separate `feature/` branches and merge into `main` using squash merges.

---

## Sample Execution Commands
- Start Backend: `uvicorn app.main:app --reload`
- Start Frontend: `npm run dev`
- Run Tests: `pytest`
