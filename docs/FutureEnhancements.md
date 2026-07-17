# Title: Future Enhancements Roadmap - Credit Compass
* **Version**: v1.0.0
* **Purpose**: Development roadmap detailing Phase 2, Phase 3, production features, cloud migration, and advanced AI integrations.
* **Author**: Team Credit Compass (A, B, C, D)
* **Last Updated**: 2026-07-17
* **Dependencies**: [PRD.md](file:///c:/Users/DP/Documents/Programming Languages/Credt_Compass/Credit_Compass/docs/PRD.md)
* **Related Documents**: [TechSpec.md](file:///c:/Users/DP/Documents/Programming Languages/Credt_Compass/Credit_Compass/docs/TechSpec.md), [DeploymentGuide.md](file:///c:/Users/DP/Documents/Programming Languages/Credt_Compass/Credit_Compass/docs/DeploymentGuide.md)

---

## Table of Contents
1. [Evolutionary Roadmap (Phases 1-3)](#evolutionary-roadmap-phases-1-3)
2. [Phase 2: Verified Alternative Data Integrations](#phase-2-verified-alternative-data-integrations)
3. [Phase 3: Production Scaling & Cloud Migration](#phase-3-production-scaling--cloud-migration)
4. [Advanced AI & ML Improvements](#advanced-ai--ml-improvements)
5. [OCR Document Ingestion Pipeline](#ocr-document-ingestion-pipeline)
6. [Interactive Voice Assistant Module](#interactive-voice-assistant-module)
7. [Implementation Notes & Assumptions](#implementation-notes--assumptions)

---

## Evolutionary Roadmap (Phases 1-3)

```
[Phase 1: Hackathon MVP] ──> Manual inputs, SQLite DB, local SHAP models
            │
            v
[Phase 2: Plaid & OCR]    ──> Bank API connect, OCR statements, advanced ML
            │
            v
[Phase 3: Cloud Scaling]  ──> Postgres migrations, serverless APIs, voice tools
```

---

## Phase 2: Verified Alternative Data Integrations
To move beyond manual inputs, Phase 2 focuses on integrating third-party APIs:
- **Plaid API Integration**: Connect user bank accounts to pull verified transaction records. This allows the system to analyze rent payments, utilities, and subscription fees automatically.
- **Micro-Investing Platform Integrations**: Partner with micro-investing APIs (like Alpaca or DriveWealth) to allow users to move from simulations to actual investing.

---

## Phase 3: Production Scaling & Cloud Migration
To prepare the application for production scale:
- **Database Migration**: Move from local SQLite databases to **PostgreSQL** (hosted on Supabase or AWS RDS) to support concurrent writes and scale database performance.
- **Serverless API Layer**: Deploy the FastAPI backend to serverless cloud environments (like AWS Lambda or Google Cloud Run) to scale compute resources based on user demand.

---

## Advanced AI & ML Improvements
- **Model Upgrades**: Transition from Logistic Regression to more advanced models like **XGBoost** or **LightGBM** to capture non-linear relationships in payment behaviors.
- **Deep SHAP and Tree Explainer Integrations**: Implement tree-specific explainer algorithms to speed up SHAP computations on larger datasets.

---

## OCR Document Ingestion Pipeline
To help users import payment records from non-digital sources:
- **OCR Engine**: Build a document upload tool that parses PDF utility bills and rent receipts.
- **LLM-Based Data Extraction**: Use lightweight LLMs (like GPT-4o-mini) to extract billing dates, payment amounts, and late indicators from parsed text.

---

## Interactive Voice Assistant Module
- **Conversational Voice Interface**: Integrate WebRTC-based voice tools to allow users to complete their risk profiling chat using voice inputs.
- **Speech-to-Text & Text-to-Speech**: Implement Whisper API models to parse user voice inputs and convert advisor responses into natural speech.

---

## Implementation Notes & Assumptions
- **Plaid Scoping**: Plaid integrations will require setting up developer agreements and configuring sandbox testing environments.
- **Compliance Considerations**: Transitioning to real brokerage integrations in Phase 2 will require working with compliance teams to register under Finra and SEC guidelines.
