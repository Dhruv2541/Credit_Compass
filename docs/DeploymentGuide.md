# Title: Deployment Guide - Credit Compass
* **Version**: v1.0.0
* **Purpose**: Step-by-step instructions for building and deploying production assets, setting environment variables, and executing rollback protocols.
* **Author**: Team Credit Compass (A, B, C, D)
* **Last Updated**: 2026-07-17
* **Dependencies**: [TechSpec.md](file:///c:/Users/DP/Documents/Programming Languages/Credt_Compass/Credit_Compass/docs/TechSpec.md)
* **Related Documents**: [GitWorkflow.md](file:///c:/Users/DP/Documents/Programming Languages/Credt_Compass/Credit_Compass/docs/GitWorkflow.md), [FutureEnhancements.md](file:///c:/Users/DP/Documents/Programming Languages/Credt_Compass/Credit_Compass/docs/FutureEnhancements.md)

---

## Table of Contents
1. [Deployment Strategy Overview](#deployment-strategy-overview)
2. [Frontend Deployment (GitHub Pages)](#frontend-deployment-github-pages)
3. [Backend Deployment (Render Web Service)](#backend-deployment-render-web-service)
4. [Environment Variable Matrix](#environment-variable-matrix)
5. [Production Launch Checklist](#production-launch-checklist)
6. [Rollback Plan & Recovery Actions](#rollback-plan--recovery-actions)
7. [Implementation Notes & Limitations](#implementation-notes--limitations)

---

## Deployment Strategy Overview
To optimize cost and setup time for the hackathon, the system separates client assets from backend services:
- **Frontend SPA**: Built and hosted as static files on **GitHub Pages**.
- **Backend API**: Hosted on **Render** (free web service instance running a Python Uvicorn image).
- **Relational DB**: File-based **SQLite** running on the Render host instance.

---

## Frontend Deployment (GitHub Pages)

### Manual Compilation & Deploy
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Compile production assets using Vite:
   ```bash
   npm run build
   ```
   *Note: This generates static output files under `/frontend/dist/`.*
3. Push output assets to the `gh-pages` branch using deployment tools:
   ```bash
   npx gh-pages -d dist
   ```

### GitHub Actions Automations (Alternative)
A GitHub action workflow in `.github/workflows/deploy_frontend.yml` compiles and publishes code automatically when commits are merged to the `main` branch.

---

## Backend Deployment (Render Web Service)

### Service Configurations
1. Create a new **Web Service** in the Render console, linking it to your project's GitHub repository.
2. Select the repository root folder as the target path.
3. Configure the following project parameters:
   - **Environment**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`
4. Set the billing plan to the Free Tier.

---

## Environment Variable Matrix
Set these environment variables before building application packages:

### React Client Variables (Render Settings)
Set in the frontend hosting console or using local build tools:
- `VITE_API_BASE_URL`: The production API URL (e.g., `https://credit-compass-api.onrender.com/api/v1`).

### FastAPI Server Variables (Render Dashboard Settings)
Define these inside Render's environment config dashboard:
- `SECRET_KEY`: Long random string used to sign JWT token values.
- `DATABASE_URL`: `sqlite:///./credit_compass.db`
- `ENVIRONMENT`: `production`
- `ALLOWED_ORIGINS`: `https://your-github-username.github.io` (enforces CORS protection).

---

## Production Launch Checklist
Verify the following configurations before presenting the application:

- [ ] Disable backend debug logs.
- [ ] Verify that database migrations run successfully during startups.
- [ ] Set frontend URLs to use production URLs instead of `localhost`.
- [ ] Confirm CORS settings permit communication between GitHub Pages and Render.
- [ ] Check that the persistent disclaimer banner is visible on the dashboard.

---

## Rollback Plan & Recovery Actions
If a deployment fails, follow these rollback steps to restore the last working version:

### Frontend Rollback
1. Find the commit ID of the last working build in the git history.
2. Force-push the build assets for that commit to the deployment branch:
   ```bash
   git checkout <last-working-commit-hash>
   npm run build
   npx gh-pages -d dist
   ```

### Backend Rollback
1. Open the Render web service dashboard.
2. Navigate to the **Deploys** tab.
3. Locate the last working deployment record.
4. Click the options menu next to the record and select **Rollback to this deploy**. This will revert the API container instantly.

---

## Implementation Notes & Limitations
- **Render Free Tier Cold Starts**: Render's free tier spins down backend instances after 15 minutes of inactivity. When a user first opens the application, it may take up to 50 seconds for the backend to start up and respond to the login request.
- **SQLite Persistence**: SQLite files are stored on Render's local disk. Note that deployments and server restarts will wipe database changes. For the hackathon, we initialize database seeds automatically during startups to ensure the app is ready to demo.
