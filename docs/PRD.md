# Title: Product Requirements Document (PRD) - Credit Compass
* **Version**: v1.0.0
* **Purpose**: Establish project vision, scope, functional/non-functional requirements, and success metrics for the hackathon MVP.
* **Author**: Team Credit Compass (A, B, C, D)
* **Last Updated**: 2026-07-17
* **Dependencies**: None
* **Related Documents**: [README.md](file:///c:/Users/DP/Documents/Programming Languages/Credt_Compass/Credit_Compass/docs/README.md), [TechSpec.md](file:///c:/Users/DP/Documents/Programming Languages/Credt_Compass/Credit_Compass/docs/TechSpec.md), [Design.md](file:///c:/Users/DP/Documents/Programming Languages/Credt_Compass/Credit_Compass/docs/Design.md)

---

## Table of Contents
1. [Vision & Mission](#vision--mission)
2. [Product Objectives & Business Goals](#product-objectives--business-goals)
3. [Success Metrics](#success-metrics)
4. [Target Audience & Personas](#target-audience--personas)
5. [User Stories](#user-stories)
6. [Functional Requirements](#functional-requirements)
7. [Non-Functional Requirements](#non-functional-requirements)
8. [Acceptance Criteria](#acceptance-criteria)
9. [MVP vs. Stretch Goals](#mvp-vs-stretch-goals)
10. [Out of Scope](#out-of-scope)
11. [Risk Register (Product Context)](#risk-register-product-context)
12. [Product Assumptions & Dependencies](#product-assumptions--dependencies)
13. [Implementation Notes & Recommendations](#implementation-notes--recommendations)

---

## Vision & Mission

### Vision
To democratize credit assessment and wealth generation for the underserved and "credit-invisible," establishing transparency as the baseline for consumer finance.

### Mission
To build an explainable AI system that parses alternative financial signatures to reveal hidden creditworthiness, while providing conversational risk profiling and simulated, educational micro-investments to help users confidently navigate their financial future.

---

## Product Objectives & Business Goals
- **Empower the Credit Invisible**: Provide an alternative assessment mechanism that bridges the gap between payment behaviors and credit viability.
- **Demystify Artificial Intelligence**: Use explainable AI to turn complex score predictions into actionable habits.
- **Lower the Investment Barrier**: Bridge credit repair and wealth generation by offering an educational simulator tailored to user-specific risk thresholds.

---

## Success Metrics

| Metric | Target | Measurement Method |
|--------|--------|---------------------|
| **User Completion Rate** | > 85% | Percentage of users finishing conversational risk profiling. |
| **Explanation Clarity Rating** | > 4.5 / 5.0 | User feedback widget evaluation of SHAP-based explanations. |
| **API Response Latency** | < 200ms | Average response time for credit probability calculation. |
| **UI Responsiveness** | 100% | Mobile-friendly rendering check on lighthouse & automated tests. |

---

## Target Audience & Personas

### Target Audience
1. **Credit-Invisible Individuals**: Have regular earnings (gigs, rent records) but no formal loans/credit lines.
2. **College Students & Gen-Z**: Want to build credit and learn investing but are overwhelmed by typical stock/brokerage apps.
3. **Young Professionals**: Starting their careers, looking for clear guidance on financial health.

### Personas

```
+--------------------------------------------------------+
| PERSONA A: "The Gig Worker"                            |
| Name: Marcus Chen | Age: 23 | Role: Freelance Designer  |
| Bio: Earns $3,500/mo. Pays rent on time. Rejected for  |
| credit cards because of a lack of credit history.      |
| Pain Points: Traditional systems mark him as high risk. |
| Needs: Transparent alternative credit score & advice.  |
+--------------------------------------------------------+
```

```
+--------------------------------------------------------+
| PERSONA B: "The Student Investor"                      |
| Name: Sarah Jenkins | Age: 20 | Role: College Junior   |
| Bio: Has $50/mo left after essentials. Wants to invest  |
| but has zero experience and is terrified of losses.   |
| Pain Points: Investing seems like gambling.            |
| Needs: Conversational, low-stress risk profiling &     |
| education-focused growth simulation.                   |
+--------------------------------------------------------+
```

---

## User Stories

### Credit Scoring & XAI
- **US-101**: As a credit-invisible user, I want to submit alternative data (rent, utility, subscription payments) so that my creditworthiness can be evaluated fairly.
- **US-102**: As a user, I want to see the key factors that determined my credit score so that I understand exactly what impacts my financial profile.
- **US-103**: As a user, I want to receive specific, actionable tips to improve my alternative credit score so that I can raise it over time.

### Conversational Risk Profiling & Investment Recommendation
- **US-201**: As a first-time investor, I want to chat with a guided AI assistant to assess my risk tolerance without feeling intimidated by financial jargon.
- **US-202**: As an investor, I want to view a personalized portfolio matching my risk category so that I understand what asset allocation fits my profile.
- **US-203**: As an investor, I want to simulate my wealth growth over a 10-year period with adjustable contributions so that I can visualize long-term returns.

---

## Functional Requirements

### 1. Authentication & Profiling
- **FR-1.1**: The system must allow users to register an account with an email, password, and basic demographics.
- **FR-1.2**: User passwords must be salted and hashed before storing in the database.
- **FR-1.3**: The system must issue JWT tokens upon successful login to authorize subsequent API requests.

### 2. Credit Assessment Engine (Explainable AI)
- **FR-2.1**: The system must collect alternative indicators: Monthly Savings Rate, Rent Payment Delay Days, Utility Bill Delays, Subscription Count, and Debt-to-Income Ratio.
- **FR-2.2**: The system must run a pre-trained ML model to compute a credit likelihood score mapped to a range of 300 to 850.
- **FR-2.3**: The system must run SHAP to identify the top 3 positive and top 3 negative variables impacting the user's score.
- **FR-2.4**: The system must map SHAP outputs to human-readable explanations and display them as a clean dashboard visual.

### 3. Conversational Risk Profiling
- **FR-3.1**: The system must host a conversational wizard asking 5 key risk assessment questions (investment horizon, loss comfort, saving behavior, target return, knowledge level).
- **FR-3.2**: The backend must process the answers and classify the user into one of three risk profiles: **Conservative**, **Moderate**, or **Aggressive**.
- **FR-3.3**: The conversation interface must feel interactive and support message histories.

### 4. Portfolio Growth Simulator
- **FR-4.1**: The system must suggest an asset allocation based on the user's risk profile (Conservative: Bonds/Cash, Moderate: Index ETFs/Bonds, Aggressive: Growth Equities/Crypto).
- **FR-4.2**: The system must simulate investment growth over a 10-year horizon using standard compounding formulas based on historical return expectations of the allocated assets.
- **FR-4.3**: The user must be able to toggle the initial capital and monthly contribution amount, triggering automatic simulator chart updates.
- **FR-4.4**: An educational disclaimer must be visible at the footer of all investment-related dashboards.

---

## Non-Functional Requirements
- **NFR-1 (Security)**: JWT tokens must expire after 24 hours. Sensitive APIs must return a `401 Unauthorized` status for invalid or missing tokens.
- **NFR-2 (Performance)**: The credit scoring ML inference and SHAP explainability response must complete in under 500ms.
- **NFR-3 (Usability)**: The UI must be fully responsive across mobile, tablet, and desktop breakpoints using Tailwind CSS container grids.
- **NFR-4 (Reliability)**: The database must persist state across user sessions, avoiding data loss during active testing.

---

## Acceptance Criteria

### Milestone 1: Core Authentication & Dashboard
- **AC-1.1**: Sign up creates an active record in the SQLite database. Login returns a valid JWT token.
- **AC-1.2**: Accessing `/dashboard` without a token redirects the user to the `/login` page.

### Milestone 2: Explainable Credit Predictions
- **AC-2.1**: The user submits alternative data and receives a credit score between 300 and 850.
- **AC-2.2**: The dashboard renders a Recharts bar/gauge indicating the score and lists the top 3 items increasing the score and top 3 items decreasing it.

### Milestone 3: Chat Risk Profiling & Sim
- **AC-3.1**: Completing the 5-question chat wizard outputs a finalized risk status.
- **AC-3.2**: Recharts displays the 10-year growth projection graph based on dynamic input adjustments.
- **AC-3.3**: The educational disclaimer is clearly displayed in a banner at the bottom of the workspace dashboard.

---

## MVP vs. Stretch Goals

```
+--------------------------------------------+
|                MVP FEATURES                |
| - JWT login/signup                        |
| - Mock input for alternative signals       |
| - Scikit-Learn Model & SHAP Explanations   |
| - 5-Step Chat Risk Assessment Dialog       |
| - Asset allocation recommendations         |
| - Compounding growth simulation (Recharts) |
+--------------------------------------------+
                      |
                      v
+--------------------------------------------+
|               STRETCH GOALS                |
| - Interactive sandbox to toggle signals    |
| - PDF Report export for Credit Compass card|
| - Real-time news feed on personal finance  |
+--------------------------------------------+
```

---

## Out of Scope
- Integration with real credit bureaus (Equifax, Experian, TransUnion).
- Real monetary deposits, brokerage accounts, or actual stock transactions.
- Automated tax calculation or financial advisory liabilities.

---

## Risk Register (Product Context)
- **R-1 (Over-promising Scores)**: Users might believe alternative scores are globally recognized.
  * *Mitigation*: Display clear information indicators highlighting that this is a simulated *alternative likelihood index*.
- **R-2 (Inaccurate Risk Classification)**: Conversational profiling could misclassify user intent.
  * *Mitigation*: Allow users to override or retake the risk questionnaire.

---

## Product Assumptions & Dependencies
- **Assumption**: Users have basic web-literacy and access to web browsers supporting Javascript ES6 features (required for Recharts and Tailwind transitions).
- **Dependency**: The backend relies on standard pre-trained ML models; no real-time online training will take place during the hackathon.

---

## Implementation Notes & Recommendations
- **Recommendation 1**: Ensure the footer disclaimer is styled with high contrast so it is clearly visible during the judge's demo.
- **Recommendation 2**: Pre-populate the alternative input fields with logical defaults so that judges do not need to think of realistic alternative financial data on the fly.
