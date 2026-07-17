# Title: Coding Standards & Style Conventions - Credit Compass
* **Version**: v1.0.0
* **Purpose**: Style standards, naming guidelines, comments, imports, and git practices for developers.
* **Author**: Team Credit Compass (A, B, C, D)
* **Last Updated**: 2026-07-17
* **Dependencies**: None
* **Related Documents**: [GitWorkflow.md](file:///c:/Users/DP/Documents/Programming Languages/Credt_Compass/Credit_Compass/docs/GitWorkflow.md), [Master_Prompt.md](file:///c:/Users/DP/Documents/Programming Languages/Credt_Compass/Credit_Compass/docs/Master_Prompt.md)

---

## Table of Contents
1. [General Coding Philosophy](#general-coding-philosophy)
2. [Python Style Standards (FastAPI & ML)](#python-style-standards-fastapi--ml)
3. [React Style Standards (Javascript ES6)](#react-style-standards-javascript-es6)
4. [Tailwind CSS Styling Conventions](#tailwind-css-styling-conventions)
5. [Documentation & Comment Standards](#documentation--comment-standards)
6. [Import Layout Guidelines](#import-layout-guidelines)
7. [Testing Conventions](#testing-conventions)
8. [Git Commit Formatting Rules](#git-commit-formatting-rules)
9. [Implementation Notes & Tool Configurations](#implementation-notes--tool-configurations)

---

## General Coding Philosophy
- **Readability**: Code should be readable. Use self-documenting variable names.
- **Modularity**: Design components around single responsibilities. Keep backend routes, model predictions, and UI views separate.
- **Fail Gracefully**: Wrap network operations and model inputs in error-handling logic.

---

## Python Style Standards (FastAPI & ML)
- Follow **PEP 8** style guidelines.
- **Formatting**: Limit line lengths to 80 characters where possible.
- **Naming Conventions**:
  - Class Names: PascalCase (e.g., `AlternativeSignals`).
  - Function & Variable Names: snake_case (e.g., `calculate_shap_values`).
  - Constants: UPPER_SNAKE_CASE (e.g., `JWT_EXPIRY_HOURS`).
- **Type Hints**: Always add type annotations to function arguments and returns:
  ```python
  def predict_score(user_id: int, data: dict) -> int:
  ```

---

## React Style Standards (Javascript ES6)
- **Formatting**: Style files using Prettier defaults (2 spaces, double quotes).
- **Naming Conventions**:
  - File Names: PascalCase for components (e.g., `CreditGauge.jsx`), camelCase for utility hooks (e.g., `useAxios.js`).
  - Component Names: PascalCase (e.g., `DashboardView`).
  - Custom Hooks: Prefix with `use` (e.g., `useAuthContext`).
- **Functional Components**: Build components using ES6 arrow functions:
  ```javascript
  const CreditGauge = ({ score }) => { ... }
  ```

---

## Tailwind CSS Styling Conventions
- **Ordering**: Organize class names logically:
  1. Layout (e.g., `flex`, `grid`, `absolute`)
  2. Spacing (e.g., `p-4`, `m-2`)
  3. Sizing (e.g., `w-full`, `h-32`)
  4. Typography (e.g., `text-lg`, `font-bold`)
  5. Borders & Colors (e.g., `bg-slate-900`, `border-white/5`)
- **Transitions**: Apply transition settings to hover elements:
  `hover:bg-slate-800 transition-colors duration-200`

---

## Documentation & Comment Standards
- **Python Docstrings**: Format docstrings using PEP 257 guidelines:
  ```python
  def run_inference(self, signals: dict) -> dict:
      """
      Executes Scikit-Learn logistic classification model.
      
      Args:
          signals: Key-value dictionary containing alternative parameters.
          
      Returns:
          Dictionary mapping predicted credit score and probability class.
      """
  ```
- **JavaScript Docstrings**: Format comments using JSDoc patterns:
  ```javascript
  /**
   * Formats investment balance data for chart rendering.
   * @param {number} principal - The starting investment amount.
   * @returns {Array<Object>} Projected balances array.
   */
  ```

---

## Import Layout Guidelines

### Python Imports Order
1. Standard Library Imports (e.g., `os`, `json`, `datetime`)
2. Third-Party Library Imports (e.g., `fastapi`, `sqlalchemy`, `shap`)
3. Local Application Modules (e.g., `app.core`, `app.models`)

### JavaScript Imports Order
1. React Core and Library Imports (e.g., `react`, `react-router-dom`)
2. Local UI Components (e.g., `@/components/ui/Button`)
3. Context, Hooks, and API Services (e.g., `@/context/AuthContext`)

---

## Testing Conventions
- **Naming Tests**: Prefix test files and functions with `test_` (e.g., `test_auth.py`).
- **Testing Structure**: Organize test code using the Arrange-Act-Assert pattern:
  ```python
  def test_login_invalid_password():
      # Arrange
      payload = {"email": "user@gmail.com", "password": "wrongpassword"}
      
      # Act
      response = client.post("/auth/login", json=payload)
      
      # Assert
      assert response.status_code == 401
  ```

---

## Git Commit Formatting Rules
Write semantic commit messages:
- `feat`: Code changes implementing new features.
- `fix`: Code changes resolving active bugs.
- `docs`: Documentation updates.
- `refactor`: Structural updates that do not change external logic.
Example commit: `feat: add SHAP explainability service and dashboard charts`

---

## Implementation Notes & Tool Configurations
- **Tooling**: Ensure ESLint config files are set up in the frontend root directory to check React compliance before commits.
- **Pre-commit checks**: Run `flake8` or `black` on backend files to verify PEP 8 compliance.
