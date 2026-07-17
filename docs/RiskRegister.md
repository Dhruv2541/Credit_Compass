# Title: Risk Register - Credit Compass
* **Version**: v1.0.0
* **Purpose**: Identify, score, and mitigate technical, business, and timeline risks for the Credit Compass project.
* **Author**: Team Credit Compass (A, B, C, D)
* **Last Updated**: 2026-07-17
* **Dependencies**: None
* **Related Documents**: [PRD.md](file:///c:/Users/DP/Documents/Programming Languages/Credt_Compass/Credit_Compass/docs/PRD.md), [TechSpec.md](file:///c:/Users/DP/Documents/Programming Languages/Credt_Compass/Credit_Compass/docs/TechSpec.md)

---

## Table of Contents
1. [Risk Management Framework](#risk-management-framework)
2. [Risk Matrix Summary](#risk-matrix-summary)
3. [Detailed Technical Risks](#detailed-technical-risks)
4. [Detailed Business & Regulatory Risks](#detailed-business--regulatory-risks)
5. [Detailed Timeline & Execution Risks](#detailed-timeline--execution-risks)
6. [Implementation Notes & Monitoring Plan](#implementation-notes--monitoring-plan)

---

## Risk Management Framework
We evaluate risks using a standard Likelihood and Impact grid:
- **Likelihood**: Low, Medium, High
- **Impact**: Low, Medium, High

Critical risks (High Likelihood + High Impact) are prioritized, and we establish active mitigation strategies for them.

---

## Risk Matrix Summary

| Risk ID | Category | Description | Likelihood | Impact | Priority |
|---------|----------|-------------|------------|--------|----------|
| **TR-01** | Technical | SQLite database files locked under concurrent requests. | Medium | High | High |
| **TR-02** | Technical | ML model training fails or serializers fail to load. | Low | High | Medium |
| **BR-01** | Business | Compliance concerns regarding automated investment advice. | High | High | High |
| **BR-02** | Business | Users misinterpret the alternative credit score. | Medium | Medium | Medium |
| **TL-01** | Timeline | Delays integrating API routers with frontend views. | Medium | High | High |
| **TL-02** | Timeline | Render free tier spin-up delays disrupt the pitch demo. | High | Medium | Medium |

---

## Detailed Technical Risks

### TR-01: SQLite Database Connection Locks
- **Description**: SQLite does not support concurrent write operations. Multiple users writing to the database at the same time could trigger lock errors.
- **Mitigation**: Configure SQLAlchemy connections with a 5-second timeout and use async session utilities to handle database operations quickly.

### TR-02: ML Pipeline Initialization Errors
- **Description**: The pretrained model file (`model.pkl`) could fail to load or be corrupted during deployment.
- **Mitigation**: Implement fallback heuristic rules in `CreditService` so the application can still generate scores and run tests if the model fails to load.

---

## Detailed Business & Regulatory Risks

### BR-01: Compliance Issues with Financial Advisory Regulations
- **Description**: Offering investment advice without a license can lead to regulatory issues.
- **Mitigation**: Display a clear, persistent disclaimer banner at the bottom of the workspace dashboard stating that all projections are simulated and for educational use only.

### BR-02: Misinterpretation of Credit Scores
- **Description**: Users might assume the alternative credit score is globally recognized by traditional financial institutions.
- **Mitigation**: Clearly label the score as an *Alternative Credit Likelihood Index* and include information icons to explain its purpose.

---

## Detailed Timeline & Execution Risks

### TL-01: Frontend-Backend Integration Delays
- **Description**: Delays when connecting React page views to FastAPI REST routes can impact project timelines.
- **Mitigation**: Define API payloads in [API_Documentation.md](file:///c:/Users/DP/Documents/Programming Languages/Credt_Compass/Credit_Compass/docs/API_Documentation.md) early in the project. This allows frontend developers to build pages using mock data while backend routes are being developed.

### TL-02: Render Free Tier Spin-Down Delays
- **Description**: Render's free tier spins down services after 15 minutes of inactivity, which could delay loading during the live presentation.
- **Mitigation**: Open the application and send test requests 5 minutes before the presentation to ensure the backend is active.

---

## Implementation Notes & Monitoring Plan
- **Risk Tracking**: Team members check the status of risks during daily standups.
- **Trigger Events**: If a server endpoint timeout occurs during testing, developers should immediately review database connections and log outputs to address potential TR-01 issues.
