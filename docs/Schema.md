# Title: Schema Specification - Credit Compass
* **Version**: v1.0.0
* **Purpose**: Database schema models, API payload structures, constraints, and synthetic dataset structures.
* **Author**: Team Credit Compass (A, B, C, D)
* **Last Updated**: 2026-07-17
* **Dependencies**: [TechSpec.md](file:///c:/Users/DP/Documents/Programming Languages/Credt_Compass/Credit_Compass/docs/TechSpec.md)
* **Related Documents**: [Architecture.md](file:///c:/Users/DP/Documents/Programming Languages/Credt_Compass/Credit_Compass/docs/Architecture.md), [API_Documentation.md](file:///c:/Users/DP/Documents/Programming Languages/Credt_Compass/Credit_Compass/docs/API_Documentation.md)

---

## Table of Contents
1. [Entity-Relationship Diagram (ERD)](#entity-relationship-diagram-erd)
2. [SQLite Database Schema](#sqlite-database-schema)
   - [Users Table](#users-table)
   - [AlternativeSignals Table](#alternativesignals-table)
   - [CreditPredictions Table](#creditpredictions-table)
   - [RiskAssessments Table](#riskassessments-table)
   - [Portfolios Table](#portfolios-table)
3. [Relationships, Constraints, & Indexes](#relationships-constraints--indexes)
4. [Pydantic API Validation Schemas](#pydantic-api-validation-schemas)
5. [Synthetic Dataset Structure](#synthetic-dataset-structure)
6. [Implementation Notes & Database Edge Cases](#implementation-notes--database-edge-cases)

---

## Entity-Relationship Diagram (ERD)

```mermaid
erDiagram
    USERS ||--o| ALTERNATIVE_SIGNALS : "provides"
    USERS ||--o| CREDIT_PREDICTIONS : "owns"
    USERS ||--o| RISK_ASSESSMENTS : "completes"
    USERS ||--o1 PORTFOLIOS : "assigned"

    USERS {
        int id PK
        string email UNIQUE
        string password_hash
        string first_name
        string last_name
        datetime created_at
    }

    ALTERNATIVE_SIGNALS {
        int id PK
        int user_id FK
        float monthly_savings_rate
        int rent_delays
        int utility_delays
        int active_subscriptions
        float debt_to_income
        datetime updated_at
    }

    CREDIT_PREDICTIONS {
        int id PK
        int user_id FK
        int credit_score
        float probability
        string shap_contributions_json
        datetime calculated_at
    }

    RISK_ASSESSMENTS {
        int id PK
        int user_id FK
        string raw_responses_json
        string risk_tier
        datetime assessed_at
    }

    PORTFOLIOS {
        int id PK
        int user_id FK
        string risk_tier
        float allocation_bonds
        float allocation_etfs
        float allocation_equities
        float allocation_crypto
        datetime assigned_at
    }
```

---

## SQLite Database Schema

### Users Table
Stores core credentials and basic registration metadata.

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### AlternativeSignals Table
Stores alternative financial variables utilized in credit model inferences.

```sql
CREATE TABLE alternative_signals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    monthly_savings_rate REAL NOT NULL CHECK(monthly_savings_rate >= 0.0 AND monthly_savings_rate <= 100.0),
    rent_delays INTEGER NOT NULL CHECK(rent_delays >= 0),
    utility_delays INTEGER NOT NULL CHECK(utility_delays >= 0),
    active_subscriptions INTEGER NOT NULL CHECK(active_subscriptions >= 0),
    debt_to_income REAL NOT NULL CHECK(debt_to_income >= 0.0 AND debt_to_income <= 100.0),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### CreditPredictions Table
Stores credit output metrics, probabilities, and JSON stringified arrays of SHAP scores.

```sql
CREATE TABLE credit_predictions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    credit_score INTEGER NOT NULL CHECK(credit_score >= 300 AND credit_score <= 850),
    probability REAL NOT NULL,
    shap_contributions_json TEXT NOT NULL,
    calculated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### RiskAssessments Table
Stores chat history parameters and the calculated risk profile classification.

```sql
CREATE TABLE risk_assessments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    raw_responses_json TEXT NOT NULL,
    risk_tier VARCHAR(50) NOT NULL CHECK(risk_tier IN ('Conservative', 'Moderate', 'Aggressive')),
    assessed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Portfolios Table
Stores user portfolios mapping to targeted asset classes.

```sql
CREATE TABLE portfolios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    risk_tier VARCHAR(50) NOT NULL CHECK(risk_tier IN ('Conservative', 'Moderate', 'Aggressive')),
    allocation_bonds REAL NOT NULL CHECK(allocation_bonds >= 0.0 AND allocation_bonds <= 100.0),
    allocation_etfs REAL NOT NULL CHECK(allocation_etfs >= 0.0 AND allocation_etfs <= 100.0),
    allocation_equities REAL NOT NULL CHECK(allocation_equities >= 0.0 AND allocation_equities <= 100.0),
    allocation_crypto REAL NOT NULL CHECK(allocation_crypto >= 0.0 AND allocation_crypto <= 100.0),
    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## Relationships, Constraints, & Indexes
- **Cascade Deletion**: All child tables point to `users(id)` with a `ON DELETE CASCADE` constraint.
- **Indexes**:
  - `idx_users_email` on `users(email)` for fast login scans.
  - `idx_predictions_user` on `credit_predictions(user_id)` to quickly load dashboard history profiles.

---

## Pydantic API Validation Schemas

### Alternative Signals Request Schema
Used to validate inputs submitted by users.

```python
from pydantic import BaseModel, Field

class AlternativeSignalsRequest(BaseModel):
    monthly_savings_rate: float = Field(..., ge=0.0, le=100.0, description="Savings as percentage of total monthly income")
    rent_delays: int = Field(..., ge=0, description="Total days late paying rent in the last 12 months")
    utility_delays: int = Field(..., ge=0, description="Total days late paying utility bills in the last 12 months")
    active_subscriptions: int = Field(..., ge=0, description="Count of recurring software/entertainment subscriptions")
    debt_to_income: float = Field(..., ge=0.0, le=100.0, description="Ratio of recurring monthly debt obligations to income")
```

### Credit Score Response Schema
```python
from typing import Dict, List
from pydantic import BaseModel

class ShapImpact(BaseModel):
    feature: str
    impact_value: float
    direction: str  # "positive" or "negative"
    description: str

class CreditScoreResponse(BaseModel):
    user_id: int
    credit_score: int
    probability_class: str
    top_impacts: List[ShapImpact]
```

---

## Synthetic Dataset Structure
To train the baseline Scikit-Learn classifier, a script generates a CSV containing 5,000 synthetic customer records with standard labels.

| Column | Type | Target Distribution / Limits |
|--------|------|------------------------------|
| `savings_rate` | Float | Normal distribution ($\mu=18\%$, $\sigma=7\%$) |
| `rent_delays` | Integer | Poisson distribution ($\lambda=2.0$) |
| `utility_delays` | Integer | Poisson distribution ($\lambda=1.5$) |
| `active_subscriptions`| Integer | Normal distribution ($\mu=6$, $\sigma=3$) |
| `debt_to_income` | Float | Normal distribution ($\mu=25\%$, $\sigma=10\%$) |
| `default_label` | Integer | Calculated output based on weights + logistic noise (0 or 1) |

---

## Implementation Notes & Database Edge Cases
- **Edge Case (Database Session Locking)**: SQLite doesn't natively support concurrent writes. To avoid locks, SQLAlchemy configure pools must set `timeout=5.0` to force write processes to wait for the completion of active transactions.
- **Edge Case (Floating Point Precision)**: Allocations are normalized using Python float round checks to ensure the sum equals exactly `100.00%` before database commits.
- **Recommendation**: Parse SHAP JSON elements safely using python `json.loads()` inside error-handling wrappers, falling back to empty lists if the payload formatting is corrupted.
