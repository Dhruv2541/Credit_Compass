# Title: 72-Hour Hackathon Implementation Plan - Credit Compass
* **Version**: v1.0.0
* **Purpose**: Hour-by-hour task allocations, milestones, and integration checkpoints for a 72-hour hackathon.
* **Author**: Team Credit Compass (A, B, C, D)
* **Last Updated**: 2026-07-17
* **Dependencies**: [PRD.md](file:///c:/Users/DP/Documents/Programming Languages/Credt_Compass/Credit_Compass/docs/PRD.md), [TechSpec.md](file:///c:/Users/DP/Documents/Programming Languages/Credt_Compass/Credit_Compass/docs/TechSpec.md)
* **Related Documents**: [GitWorkflow.md](file:///c:/Users/DP/Documents/Programming Languages/Credt_Compass/Credit_Compass/docs/GitWorkflow.md), [TeamResponsibilities.md](file:///c:/Users/DP/Documents/Programming Languages/Credt_Compass/Credit_Compass/docs/TeamResponsibilities.md)

---

## Table of Contents
1. [Hackathon Milestone Map](#hackathon-milestone-map)
2. [Hour-by-Hour Execution Plan](#hour-by-hour-execution-plan)
   - [Day 1: Base Foundations (Hours 1 - 24)](#day-1-base-foundations-hours-1---24)
   - [Day 2: Features & ML Assembly (Hours 25 - 48)](#day-2-features--ml-assembly-hours-25---48)
   - [Day 3: Integration, Polish, & Prep (Hours 49 - 72)](#day-3-integration-polish--prep-hours-49---72)
3. [Testing Checkpoints](#testing-checkpoints)
4. [Integration Checkpoints](#integration-checkpoints)
5. [Definition of Done (DoD)](#definition-of-done-dod)
6. [Implementation Notes & Assumptions](#implementation-notes--assumptions)

---

## Hackathon Milestone Map

```
[Hours 01-12] Setup & Base Schemas ---> [Hours 13-24] Auth Flow & ML Training
                                                   │
[Hours 37-48] UI Integration & Visuals <--- [Hours 25-36] API Routes & Chat Wizard
       │
[Hours 49-60] Deployment & E2E Testing ---> [Hours 61-72] Pitch Deck & Demo Scripting
```

---

## Hour-by-Hour Execution Plan

### Day 1: Base Foundations (Hours 1 - 24)

| Hours | Member A (ML) | Member B (Backend) | Member C (Frontend) | Member D (Design/PM) |
|-------|---------------|--------------------|---------------------|----------------------|
| **01-04** | Draft synthetic data generator script. | Initialize FastAPI app, routers, and directory scaffolding. | Setup Vite, React Router, and Tailwind configurations. | Define exact JSON inputs and color tokens. |
| **05-08** | Generate 5,000 synthetic records. | Configure SQLAlchemy models and SQLite db file setup. | Build global AuthContext and useAxios hook. | Write UI wireframes and build Figma mockups. |
| **09-12** | Train LogisticRegression baseline classifier. | Write authentication routers (Signup/Login) & JWT helpers. | Implement Login & Signup pages in React. | Design card layouts and glassmorphic dashboards. |
| **13-16** | Evaluate model accuracy and serialize to `model.pkl`. | Build alternative signals router & validation models. | Build sidebar, navbar, and core glass-container styles. | Review PRD and create demo outline. |
| **17-20** | Build local SHAP Explainer prototype wrapper. | Set up model loading service on server initialization. | Connect Login/Signup forms to authentication endpoints. | Audit color contrast and check contrast ratios. |
| **21-24** | **Day 1 Checkpoint**: Verify the ML pipeline outputs SHAP value arrays correctly. | **Day 1 Checkpoint**: Verify SQLite database creates user records and logins work. | **Day 1 Checkpoint**: Confirm frontend logins redirect correctly. | Write slide layouts for the presentation. |

---

### Day 2: Features & ML Assembly (Hours 25 - 48)

| Hours | Member A (ML) | Member B (Backend) | Member C (Frontend) | Member D (Design/PM) |
|-------|---------------|--------------------|---------------------|----------------------|
| **25-28** | Integrate SHAP pipeline into backend `credit_service.py`. | Build investment profile router and schema fields. | Create credit questionnaire form page. | Design assets (logos, background gradients). |
| **29-32** | Map SHAP values to text explanations and recommendations. | Implement conversational chat state trees. | Build Chat Console screen interface in React. | Write descriptive cards for the portfolio suggestions. |
| **33-36** | Build compound growth calculation service. | Write portfolio database saving routing logic. | Connect Credit Score request dashboard to API. | Outline slide copy and speaker allocations. |
| **37-40** | Integrate growth calculation outputs into simulate route. | Implement CORS setup and security middleware. | Integrate Recharts gauge charts for credit scoring. | Detail conversational risk questions. |
| **41-44** | Test Edge Cases (e.g., zero signals input). | Write endpoint tests using pytest. | Integrate Recharts growth projection graphs. | Assemble initial presentation slide drafts. |
| **45-48** | **Day 2 Checkpoint**: Verify the credit prediction endpoint returns SHAP values in under 300ms. | **Day 2 Checkpoint**: Verify chat questionnaire tracks questions and outputs risk tier. | **Day 2 Checkpoint**: Verify dashboard renders gauge and growth charts correctly. | Record screen segments for fallback demo recordings. |

---

### Day 3: Integration, Polish, & Prep (Hours 49 - 72)

| Hours | Member A (ML) | Member B (Backend) | Member C (Frontend) | Member D (Design/PM) |
|-------|---------------|--------------------|---------------------|----------------------|
| **49-52** | Fix model performance bugs. | Build Render deployment configuration files. | Style loading skeletons and toast notification indicators. | Design landing page copy and disclaimer positions. |
| **53-56** | Conduct API testing. | Deploy FastAPI server to Render. | Deploy React build assets to GitHub Pages. | Refine presentation slides based on mock runs. |
| **57-60** | Run manual validation checks. | Verify database creation on Render instance. | Connect frontend routes to production Render API URL. | Script the word-for-word demo text. |
| **61-64** | Write project walkthrough logs. | Optimize SQLite queries to prevent connection locks. | Fix mobile rendering layout bugs. | Run live dry-runs of the presentation pitch. |
| **65-68** | Refine repository documentation. | Monitor Render log outputs for errors. | Implement interactive tips tooltips. | Polish Q&A answers for common questions. |
| **69-72** | **Final Checkpoint**: Verify production build deployments. | **Final Checkpoint**: Verify API stability under load. | **Final Checkpoint**: Test application responsiveness on mobile devices. | Deliver final deck slides and lock down repository commits. |

---

## Testing Checkpoints
1. **Hour 24 Checkpoint**: Backend must pass signup/login tests (`POST /auth/signup` and `POST /auth/login` must return valid JSON structure).
2. **Hour 48 Checkpoint**: ML pipeline model loading must complete on server startup without memory leaks.
3. **Hour 60 Checkpoint**: Deployed frontend must communicate with the production Render API endpoint using SSL.

---

## Integration Checkpoints
- **Integration 1 (Auth Connect - Hour 18)**: Connecting React Login/Signup pages to the backend authentication endpoints.
- **Integration 2 (ML Dashboard Connect - Hour 36)**: Connecting the credit input page and dashboard gauges to `/credit/predict`.
- **Integration 3 (Investment Sim Connect - Hour 44)**: Linking the chat console and compound graphs to the `/investment/chat` endpoints.

---

## Definition of Done (DoD)
A task is classified as **Done** when:
- [x] Code conforms to repository styles (checked via automated tools).
- [x] API routes include Pydantic request/response validations.
- [x] Features compile without raising error codes.
- [x] Unit test suites pass with a minimum of 80% coverage.
- [x] The code changes are merged into the `main` branch via approved PRs.

---

## Implementation Notes & Assumptions
- **Assumed Run Environment**: Code assumes Render's free web tier will experience cold-start delays. To improve UX, the frontend will display a loading message stating: *"Waking up server - please allow up to 50 seconds."*
- **Assumption**: All team members use Git semantic commits (`feat:`, `fix:`, `docs:`) to keep change history clean during fast development.
