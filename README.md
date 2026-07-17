# Credit Compass

### *Transparent Credit Scoring & AI-Powered Micro-Investment Advisor*

Credit Compass is an explainable AI-powered FinTech platform designed to provide transparent credit likelihood prediction using alternative financial signatures and conversational investment risk profiling. It targets individuals who are credit-invisible, college students, young professionals, and first-time investors.

---

## 🚀 Key Features

- **User Authentication**: Secure JWT session tokens with password encryption via native `bcrypt`.
- **Alternative Credit Dashboard**: Dynamic dashboard featuring a custom SVG credit score gauge mapped from 300 to 850.
- **Explainable AI (XAI)**: Displays localized feature contributions using SHAP-equivalent calculations indicating positive (+ green) and negative (- red) score impacts.
- **Conversational Risk Profiling**: Interactive guided dialogue checking user risk levels without financial jargon.
- **Growth Projections Simulator**: Compounding investment trajectory charts mapped via Recharts, featuring dynamic initial, monthly, and year sliders.
- **Educational Disclaimer**: Persistent visibility across dashboard panels ensuring regulatory clarity.
- **Modern FinTech Dark Theme**: Styled with Tailwind CSS v4 featuring premium glassmorphism, harmonious HSL palettes, and customized scrollbars.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS v4, Axios, React Router, Recharts, Lucide Icons.
- **Backend**: FastAPI (Python), SQLAlchemy ORM, SQLite.
- **Machine Learning**: Scikit-Learn (`LogisticRegression` pipeline), SHAP-equivalent explanations.

---

## 📂 Project Structure

- `/backend`: Core FastAPI controllers, security modules, SQLAlchemy models, and service classes.
- `/frontend`: React SPA client folder containing assets, pages, hooks, context, and styles.
- `/scripts`: Data generation and model training scripts.
- `/docs`: Complete 20-file design, architecture, and deployment documentation.

---

## 🎮 Running Locally

### Prerequisites
- Python 3.10+
- Node.js 18+

### Step 1: Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Activate a Python virtual environment:
   ```bash
   python -m venv venv
   source venv/Scripts/activate # On Windows: venv\Scripts\activate
   ```
3. Install Python dependencies:
   ```bash
   pip install fastapi uvicorn pydantic pydantic-settings sqlalchemy bcrypt pyjwt scikit-learn shap pandas numpy python-multipart passlib[bcrypt] email-validator
   ```
4. Run the data generation and model training scripts:
   ```bash
   cd ..
   python scripts/generate_data.py
   python scripts/train_model.py
   ```
5. Start the FastAPI backend server:
   ```bash
   cd backend
   python -m uvicorn app.main:app --reload --port 8000
   ```
   - API Docs will be available at: [http://localhost:8000/docs](http://localhost:8000/docs)

### Step 2: Frontend Setup
1. Open a second terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   - Local App will be available at: [http://localhost:5173](http://localhost:5173)

---

## 📖 Project Documentation Index

Detailed architectural blueprints, design guidelines, schemas, and presentation guides are available inside the `/docs` directory:

1. **[README.md](file:///c:/Users/DP/Documents/Programming%20Languages/Credt_Compass/Credit_Compass/docs/README.md)**: Repo entry and local setup guidelines.
2. **[PRD.md](file:///c:/Users/DP/Documents/Programming%20Languages/Credt_Compass/Credit_Compass/docs/PRD.md)**: Product Requirements Document.
3. **[TechSpec.md](file:///c:/Users/DP/Documents/Programming%20Languages/Credt_Compass/Credit_Compass/docs/TechSpec.md)**: Developer specifications and ML architectures.
4. **[Design.md](file:///c:/Users/DP/Documents/Programming%20Languages/Credt_Compass/Credit_Compass/docs/Design.md)**: Custom HSL palette tokens and layouts.
5. **[Schema.md](file:///c:/Users/DP/Documents/Programming%20Languages/Credt_Compass/Credit_Compass/docs/Schema.md)**: SQLite relational ER tables and Pydantic rules.
6. **[FolderStructure.md](file:///c:/Users/DP/Documents/Programming%20Languages/Credt_Compass/Credit_Compass/docs/FolderStructure.md)**: File-by-file ownership mappings.
7. **[API_Documentation.md](file:///c:/Users/DP/Documents/Programming%20Languages/Credt_Compass/Credit_Compass/docs/API_Documentation.md)**: Endpoint requests, responses, and cURL commands.
8. **[ImplementationPlan.md](file:///c:/Users/DP/Documents/Programming%20Languages/Credt_Compass/Credit_Compass/docs/ImplementationPlan.md)**: Hourly hackathon task timelines.
9. **[PresentationGuide.md](file:///c:/Users/DP/Documents/Programming%20Languages/Credt_Compass/Credit_Compass/docs/PresentationGuide.md)**: Presentation slides outlines.
10. **[DemoScript.md](file:///c:/Users/DP/Documents/Programming%20Languages/Credt_Compass/Credit_Compass/docs/DemoScript.md)**: Word-for-word live pitch dialogue.
11. **[Master_Prompt.md](file:///c:/Users/DP/Documents/Programming%20Languages/Credt_Compass/Credit_Compass/docs/Master_Prompt.md)**: Developer guidelines for AI assistants.
12. **[Architecture.md](file:///c:/Users/DP/Documents/Programming%20Languages/Credt_Compass/Credit_Compass/docs/Architecture.md)**: Container, Sequence, and Deployment diagrams.
13. **[CodingStandards.md](file:///c:/Users/DP/Documents/Programming%20Languages/Credt_Compass/Credit_Compass/docs/CodingStandards.md)**: Style conventions for Python, React, and Git.
14. **[TestingStrategy.md](file:///c:/Users/DP/Documents/Programming%20Languages/Credt_Compass/Credit_Compass/docs/TestingStrategy.md)**: Unit/API/ML tests and bug matrix guidelines.
15. **[DeploymentGuide.md](file:///c:/Users/DP/Documents/Programming%20Languages/Credt_Compass/Credit_Compass/docs/DeploymentGuide.md)**: Hosting guides for Render and GitHub Pages.
16. **[GitWorkflow.md](file:///c:/Users/DP/Documents/Programming%20Languages/Credt_Compass/Credit_Compass/docs/GitWorkflow.md)**: Branch naming and pull request workflows.
17. **[RiskRegister.md](file:///c:/Users/DP/Documents/Programming%20Languages/Credt_Compass/Credit_Compass/docs/RiskRegister.md)**: Core project risks and mitigation actions.
18. **[FutureEnhancements.md](file:///c:/Users/DP/Documents/Programming%20Languages/Credt_Compass/Credit_Compass/docs/FutureEnhancements.md)**: Post-hackathon scaling roadmaps.
19. **[DecisionLog.md](file:///c:/Users/DP/Documents/Programming%20Languages/Credt_Compass/Credit_Compass/docs/DecisionLog.md)**: Architectural Decision Records (ADRs).
20. **[TeamResponsibilities.md](file:///c:/Users/DP/Documents/Programming%20Languages/Credt_Compass/Credit_Compass/docs/TeamResponsibilities.md)**: Roles matrix for A, B, C, D.

---

## ⚠️ Disclaimer

> [!WARNING]
> Credit Compass is a simulated educational tool. All credit scores, predictions, and investment growth models are synthetic and generated for demonstration purposes only. This system does not constitute financial, investment, legal, or credit advice.

---

## 👤 Created by 
- Dhruv Padiya
- Himay Dave
- Digpalsinh Solanki
- Divy Kachhiya

## 📄 License
Licensed under the MIT License. See [LICENSE](file:///c:/Users/DP/Documents/Programming%20Languages/Credt_Compass/Credit_Compass/LICENSE) for details.
