# Title: Repository Folder Structure - Credit Compass
* **Version**: v1.0.0
* **Purpose**: Blueprint mapping directory layout, file roles, and developers' code ownership.
* **Author**: Team Credit Compass (A, B, C, D)
* **Last Updated**: 2026-07-17
* **Dependencies**: None
* **Related Documents**: [README.md](file:///c:/Users/DP/Documents/Programming Languages/Credt_Compass/Credit_Compass/docs/README.md), [TechSpec.md](file:///c:/Users/DP/Documents/Programming Languages/Credt_Compass/Credit_Compass/docs/TechSpec.md)

---

## Table of Contents
1. [High-Level Directory Map](#high-level-directory-map)
2. [Detailed Folder Breakdown](#detailed-folder-breakdown)
   - [Backend Directory (`/backend`)](#backend-directory-backend)
   - [Frontend Directory (`/frontend`)](#frontend-directory-frontend)
   - [Data & ML Scripts (`/scripts`)](#data--ml-scripts-scripts)
3. [File-by-File Ownership & Responsibility Matrix](#file-by-file-ownership--responsibility-matrix)
4. [Implementation Notes & Repository Guidelines](#implementation-notes--repository-guidelines)

---

## High-Level Directory Map

```
Credit_Compass/
├── .github/             # CI/CD Workflows
├── backend/             # FastAPI Application
├── docs/                # Project Documentation (This folder)
├── frontend/            # Vite + React + Tailwind Application
└── scripts/             # Data Synthesis & Training Scripts
```

---

## Detailed Folder Breakdown

### Backend Directory (`/backend`)
The backend logic is isolated inside `backend/`.

```
backend/
├── app/
│   ├── api/             # API Endpoints (v1 Router)
│   │   ├── auth.py      # Login, Signup, JWT Validation
│   │   ├── credit.py    # Scoring Inputs & SHAP Explanations
│   │   └── invest.py    # Conversational Agent & Projections
│   ├── core/            # App Configuration & Auth Security
│   │   ├── config.py    # Env Parser (Pydantic BaseSettings)
│   │   └── security.py  # Bcrypt Hashing & JWT Utils
│   ├── db/              # SQLAlchemy Database Setup
│   │   ├── base.py      # Base Model Class
│   │   └── session.py   # DB Session Engine
│   ├── models/          # SQLAlchemy Database Models
│   │   └── models.py    # DB Tables
│   ├── schemas/         # Pydantic Schemas (Validation)
│   │   └── schemas.py   # Request/Response validation classes
│   ├── services/        # Service Layer
│   │   ├── credit_service.py # Core scoring logic & SHAP runner
│   │   └── invest_service.py # Chat flow engine & Simulator calculator
│   └── main.py          # App initialization and CORS configs
├── models/              # Pretrained ML Models (.pkl / .joblib)
│   └── model.pkl        # Serialized LogisticRegression classifier
├── requirements.txt     # Python Dependencies
└── uvicorn_config.json  # Dev / Prod Server configs
```

### Frontend Directory (`/frontend`)
The React Single Page Application is located in `frontend/`.

```
frontend/
├── public/              # Static Icons, Logos, Background Vectors
├── src/
│   ├── assets/          # Curated fonts and images
│   ├── components/      # Shared UI Components
│   │   ├── ui/          # Atomic components (buttons, input fields)
│   │   ├── charts/      # Recharts wrappers (Gauge, Projection lines)
│   │   └── layout/      # Sidebar, Topbar, Persistent Footer
│   ├── context/         # React Context API
│   │   └── AuthContext.jsx # Global User login states & tokens
│   ├── hooks/           # Custom reusable React hooks
│   │   └── useAxios.js  # Interceptor utility for JWT tokens
│   ├── pages/           # Routed Views
│   │   ├── Login.jsx    # Auth Login view
│   │   ├── Signup.jsx   # Auth Signup view
│   │   ├── Dashboard.jsx# Credit status and SHAP highlights page
│   │   └── Advisor.jsx  # Conversational risk check & Simulator page
│   ├── App.jsx          # Route mappings and App root
│   ├── index.css        # Base Tailwind & design style injections
│   └── main.jsx         # App mounting file
├── index.html           # Root Entry Template
├── package.json         # Node Dependency map
├── tailwind.config.js   # Custom HSL palette and font setups
└── vite.config.js       # Vite configuration
```

### Data & ML Scripts (`/scripts`)
Scripts to generate synthetic datasets and train models.

```
scripts/
├── generate_data.py     # Synthesizes 5,000 credit records
└── train_model.py       # Trains Scikit-Learn Model & saves model.pkl
```

---

## File-by-File Ownership & Responsibility Matrix

| Path | Primary Owner | Secondary Owner | Role Description |
|------|---------------|-----------------|------------------|
| `/backend/app/main.py` | **Member B** | **Member A** | Initializes FastAPI, manages routers, and sets CORS rules. |
| `/backend/app/services/credit_service.py` | **Member A** | **Member B** | Imports `model.pkl` and runs SHAP explainers to score credit. |
| `/backend/app/services/invest_service.py` | **Member B** | **Member D** | Implements conversational trees and compound growth calculations. |
| `/frontend/src/context/AuthContext.jsx` | **Member B** | **Member C** | Saves, retrieves, and exposes JWT tokens from local storage. |
| `/frontend/src/pages/Dashboard.jsx` | **Member C** | **Member D** | Renders overall credit gauge charts and SHAP card panels. |
| `/frontend/src/pages/Advisor.jsx` | **Member C** | **Member A** | Builds conversational chat boxes and growth charts. |
| `/scripts/train_model.py` | **Member A** | **Member D** | Trains the Logistic Regression model using synthetic features. |

---

## Implementation Notes & Repository Guidelines
- **Modifying Files**: Always coordinate edits on directories where responsibility overlaps.
- **Git Branches**: Code edits should be done in `feature/` branches. Keep folders distinct to reduce Git conflict errors during the hackathon.
- **Environment Imports**: Do not hardcode endpoint addresses in service scripts; import them using Vite configurations or FastAPI configs instead.
