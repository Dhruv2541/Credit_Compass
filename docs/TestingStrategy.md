# Title: Testing Strategy & Quality Assurance - Credit Compass
* **Version**: v1.0.0
* **Purpose**: Quality standards, testing suites (unit, integration, API, UI), ML model validation, and bug prioritization rules.
* **Author**: Team Credit Compass (A, B, C, D)
* **Last Updated**: 2026-07-17
* **Dependencies**: [TechSpec.md](file:///c:/Users/DP/Documents/Programming Languages/Credt_Compass/Credit_Compass/docs/TechSpec.md)
* **Related Documents**: [CodingStandards.md](file:///c:/Users/DP/Documents/Programming Languages/Credt_Compass/Credit_Compass/docs/CodingStandards.md), [GitWorkflow.md](file:///c:/Users/DP/Documents/Programming Languages/Credt_Compass/Credit_Compass/docs/GitWorkflow.md)

---

## Table of Contents
1. [General QA Approach](#general-qa-approach)
2. [Unit Testing Suite](#unit-testing-suite)
3. [Integration & API Testing](#integration--api-testing)
4. [UI Component Testing](#ui-component-testing)
5. [Machine Learning Validation Protocol](#machine-learning-validation-protocol)
6. [Manual Testing Checklist](#manual-testing-checklist)
7. [Bug Priority Matrix](#bug-priority-matrix)
8. [Implementation Notes & Assumptions](#implementation-notes--assumptions)

---

## General QA Approach
Credit Compass uses automated unit testing, end-to-end API validations, and manual UI checklists to maintain code quality. All tests are integrated into our Git workflow pipelines to block regressions before code reaches production.

---

## Unit Testing Suite
- **Framework**: `pytest` for backend files.
- **Locations**: Tests are saved under `backend/tests/unit/`.
- **Target Components**:
  - Service functions (e.g., `calculate_growth_projection` compounding logic).
  - Validation schemas (checking that Pydantic raises errors for negative loan inputs).
  - Password hashing utilities.

---

## Integration & API Testing
- **Framework**: FastAPI's built-in `TestClient` class.
- **Locations**: Tests are saved under `backend/tests/integration/`.
- **Method**: Mock database sessions during test executions.
- **Verification points**:
  - `POST /auth/login` yields a valid JSON token payload.
  - Submitting missing credentials to protected API routes returns a `401 Unauthorized` response.
  - Submitting input variables out of bounds returns a `422 Unprocessable Entity` response.

---

## UI Component Testing
- **Development testing**: Render individual components in isolation using standard mock states.
- **Manual Verification**: Verify key interface points:
  - Form validation indicators display warning text for invalid inputs.
  - Interactive sliders dynamically update Recharts lines.
  - The educational disclaimer displays in a high-contrast banner.

---

## Machine Learning Validation Protocol
Since credit assessment predictions directly affect user dashboard displays, the ML pipeline includes distinct validation steps:
- **Baseline accuracy**: The Logistic Regression classifier must maintain an F1 score above `0.80` on test splits before serializing.
- **SHAP values consistency**: Ensure that:
  - Higher savings rate inputs yield positive SHAP values.
  - Late payment records (rent/utility delays) result in negative SHAP values.
- **Robustness checks**: Submitting zero or extreme values must fall back to default, safe predictions rather than raising system errors.

---

## Manual Testing Checklist
Run these manual checks before deployment:

| Category | Action | Expected Output | Status |
|----------|--------|-----------------|--------|
| **Auth** | Sign up new user. | Account is added to the SQLite database and redirects to the dashboard. | [ ] |
| **Auth** | Request a dashboard view without a JWT token. | App redirects the user to the `/login` view. | [ ] |
| **Credit** | Submit inputs: savings 25%, delays 0, debt 10%. | Score displays above 700 with positive SHAP indicators. | [ ] |
| **Investment**| Complete the 5 conversational advisor questions. | Chat ends, displays "Moderate" tier, and shows compound charts. | [ ] |
| **Responsive**| Collapse the browser window size to 375px. | Main navigation collapses into a responsive mobile header layout. | [ ] |

---

## Bug Priority Matrix
We categorize and address bugs based on their severity and priority:

| Classification | Definition | Target Resolution |
|----------------|------------|--------------------|
| **P0 (Blocker)** | Server crash, authentication bypass, data loss. | Stop all feature development and resolve immediately. |
| **P1 (High)** | ML pipeline failure, charts failing to load, API timeout. | Resolve before merging code into the main branch. |
| **P2 (Medium)**| UI layout glitches, styling differences, minor animation bugs. | Resolve before final presentation deployment. |
| **P3 (Low)** | Spelling errors, log output adjustments. | Address as time permits during the hackathon. |

---

## Implementation Notes & Assumptions
- **Testing environment**: SQLite is configured as an in-memory database during test runs. This speeds up test execution and keeps tests isolated.
- **Mocking Strategy**: External calls (like simulated model downloads) are mocked to ensure test suites can run offline.
