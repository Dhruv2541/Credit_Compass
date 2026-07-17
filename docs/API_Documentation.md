# Title: REST API Documentation - Credit Compass
* **Version**: v1.0.0
* **Purpose**: Developer reference containing backend REST API endpoint specs, payloads, response samples, and error codes.
* **Author**: Team Credit Compass (A, B, C, D)
* **Last Updated**: 2026-07-17
* **Dependencies**: [Schema.md](file:///c:/Users/DP/Documents/Programming Languages/Credt_Compass/Credit_Compass/docs/Schema.md)
* **Related Documents**: [TechSpec.md](file:///c:/Users/DP/Documents/Programming Languages/Credt_Compass/Credit_Compass/docs/TechSpec.md), [Architecture.md](file:///c:/Users/DP/Documents/Programming Languages/Credt_Compass/Credit_Compass/docs/Architecture.md)

---

## Table of Contents
1. [Base URL & Protocol](#base-url--protocol)
2. [Global Error & Status Formats](#global-error--status-formats)
3. [Authentication Endpoints](#authentication-endpoints)
   - [POST /auth/signup](#post-authsignup)
   - [POST /auth/login](#post-authlogin)
4. [Credit Scoring & SHAP Explainability Endpoints](#credit-scoring--shap-explainability-endpoints)
   - [POST /credit/predict](#post-creditpredict)
   - [GET /credit/history](#get-credithistory)
5. [Conversational Assessment & Portfolio Advisor Endpoints](#conversational-assessment--portfolio-advisor-endpoints)
   - [GET /investment/chat/status](#get-investmentchatstatus)
   - [POST /investment/chat/message](#post-investmentchatmessage)
   - [POST /investment/simulate](#post-investmentsimulate)
6. [Implementation Notes & Edge Cases](#implementation-notes--edge-cases)

---

## Base URL & Protocol
- **Development**: `http://localhost:8000/api/v1`
- **Production**: `https://credit-compass-api.onrender.com/api/v1`
- **Protocol**: HTTP/HTTPS, payloads sent in `application/json` format.

---

## Global Error & Status Formats
When an API error occurs, the server yields a structured JSON block:

```json
{
  "detail": "Descriptive error message",
  "error_code": "ERROR_CODE_STRING",
  "timestamp": "2026-07-17T19:40:00.000Z"
}
```

### Common HTTP Status Codes
- `200 OK`: Request succeeded.
- `201 Created`: Entry successfully added to the database.
- `400 Bad Request`: Payload validation failed (e.g., input values out of bounds).
- `401 Unauthorized`: Token is missing or invalid.
- `404 Not Found`: Target resource does not exist.
- `500 Internal Error`: Backend system malfunction.

---

## Authentication Endpoints

### POST /auth/signup
- **Purpose**: Registers a new user.
- **Authentication Required**: No.

#### Headers
```http
Content-Type: application/json
```

#### Body Schema
```json
{
  "email": "user@example.com",
  "password": "StrongPassword123",
  "first_name": "Marcus",
  "last_name": "Chen"
}
```

#### Example Request (cURL)
```bash
curl -X POST "http://localhost:8000/api/v1/auth/signup" \
     -H "Content-Type: application/json" \
     -d '{"email":"user@example.com","password":"StrongPassword123","first_name":"Marcus","last_name":"Chen"}'
```

#### Example Response (`201 Created`)
```json
{
  "message": "User registered successfully",
  "user_id": 42
}
```

---

### POST /auth/login
- **Purpose**: Authenticates credentials and returns a JWT token.
- **Authentication Required**: No.

#### Body Schema
```json
{
  "email": "user@example.com",
  "password": "StrongPassword123"
}
```

#### Example Request (cURL)
```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
     -H "Content-Type: application/json" \
     -d '{"email":"user@example.com","password":"StrongPassword123"}'
```

#### Example Response (`200 OK`)
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 86400
}
```

---

## Credit Scoring & SHAP Explainability Endpoints

### POST /credit/predict
- **Purpose**: Processes alternative financial indicators, calculates credit score, and returns SHAP features.
- **Authentication Required**: Yes (`Bearer <token>`).

#### Headers
```http
Authorization: Bearer <token>
Content-Type: application/json
```

#### Body Schema
```json
{
  "monthly_savings_rate": 22.5,
  "rent_delays": 0,
  "utility_delays": 1,
  "active_subscriptions": 3,
  "debt_to_income": 12.0
}
```

#### Example Request (cURL)
```bash
curl -X POST "http://localhost:8000/api/v1/credit/predict" \
     -H "Authorization: Bearer eyJhbGciOiJIUz..." \
     -H "Content-Type: application/json" \
     -d '{"monthly_savings_rate":22.5,"rent_delays":0,"utility_delays":1,"active_subscriptions":3,"debt_to_income":12.0}'
```

#### Example Response (`200 OK`)
```json
{
  "user_id": 42,
  "credit_score": 725,
  "probability_class": "High Likelihood",
  "top_impacts": [
    {
      "feature": "monthly_savings_rate",
      "impact_value": 0.42,
      "direction": "positive",
      "description": "Your savings rate of 22.5% is significantly higher than the average, boosting your credit score."
    },
    {
      "feature": "utility_delays",
      "impact_value": -0.08,
      "direction": "negative",
      "description": "Having 1 late utility payment slightly reduced your score probability."
    }
  ]
}
```

---

### GET /credit/history
- **Purpose**: Fetches previous credit scores for the logged-in user.
- **Authentication Required**: Yes (`Bearer <token>`).

#### Example Request (cURL)
```bash
curl -X GET "http://localhost:8000/api/v1/credit/history" \
     -H "Authorization: Bearer eyJhbGciOiJIUz..."
```

#### Example Response (`200 OK`)
```json
{
  "history": [
    {
      "id": 1,
      "credit_score": 680,
      "calculated_at": "2026-06-15T12:00:00.000Z"
    },
    {
      "id": 5,
      "credit_score": 725,
      "calculated_at": "2026-07-17T19:30:00.000Z"
    }
  ]
}
```

---

## Conversational Assessment & Portfolio Advisor Endpoints

### GET /investment/chat/status
- **Purpose**: Checks status of the user's conversational risk questionnaire.
- **Authentication Required**: Yes (`Bearer <token>`).

#### Example Request (cURL)
```bash
curl -X GET "http://localhost:8000/api/v1/investment/chat/status" \
     -H "Authorization: Bearer eyJhbGciOiJIUz..."
```

#### Example Response (`200 OK`)
```json
{
  "chat_completed": false,
  "next_question_id": 3,
  "next_question_text": "How do you react if your investments drop 10% in a month?",
  "options": [
    "Sell everything immediately",
    "Do nothing and wait",
    "Buy more at a discount"
  ]
}
```

---

### POST /investment/chat/message
- **Purpose**: Submits the user's response to the current profiling question.
- **Authentication Required**: Yes (`Bearer <token>`).

#### Body Schema
```json
{
  "question_id": 3,
  "selected_option": "Do nothing and wait"
}
```

#### Example Request (cURL)
```bash
curl -X POST "http://localhost:8000/api/v1/investment/chat/message" \
     -H "Authorization: Bearer eyJhbGciOiJIUz..." \
     -H "Content-Type: application/json" \
     -d '{"question_id":3,"selected_option":"Do nothing and wait"}'
```

#### Example Response (`200 OK`)
```json
{
  "received": true,
  "chat_completed": true,
  "determined_risk_tier": "Moderate",
  "recommended_allocation": {
    "bonds": 30.0,
    "etfs": 50.0,
    "equities": 15.0,
    "crypto": 5.0
  }
}
```

---

### POST /investment/simulate
- **Purpose**: Runs a compounding growth simulation based on user settings and asset allocations.
- **Authentication Required**: Yes (`Bearer <token>`).

#### Body Schema
```json
{
  "initial_amount": 1000.0,
  "monthly_contribution": 150.0,
  "time_horizon_years": 10,
  "risk_tier": "Moderate"
}
```

#### Example Request (cURL)
```bash
curl -X POST "http://localhost:8000/api/v1/investment/simulate" \
     -H "Authorization: Bearer eyJhbGciOiJIUz..." \
     -H "Content-Type: application/json" \
     -d '{"initial_amount":1000.0,"monthly_contribution":150.0,"time_horizon_years":10,"risk_tier":"Moderate"}'
```

#### Example Response (`200 OK`)
```json
{
  "total_invested": 19000.0,
  "future_value_conservative": 24200.50,
  "future_value_expected": 29850.75,
  "future_value_optimistic": 37120.30,
  "projection_data": [
    {
      "year": 0,
      "total_invested": 1000,
      "expected_value": 1000
    },
    {
      "year": 5,
      "total_invested": 10000,
      "expected_value": 13420.25
    },
    {
      "year": 10,
      "total_invested": 19000,
      "expected_value": 29850.75
    }
  ]
}
```

---

## Implementation Notes & Edge Cases
- **Validating Bounds**: Pydantic will raise validation errors if inputs like `savings_rate` fall outside of `[0.0, 100.0]`. The API translates this into a `400 Bad Request` containing the specific error details.
- **Chat Interruption**: If the user leaves mid-chat, `/chat/status` remembers their last answered question so they can resume from where they left off.
- **Model Fallback**: If the SHAP model load fails, the system outputs an explanation list based on rule-based fallbacks (e.g., matching input variables to static text tips) to ensure the UI still functions.
