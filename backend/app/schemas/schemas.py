from datetime import datetime
from typing import List, Optional, Dict
from pydantic import BaseModel, EmailStr, Field

# User Schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, description="User password must be at least 6 characters")
    first_name: Optional[str] = None
    last_name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    expires_in: int

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    first_name: Optional[str]
    last_name: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

# Alternative Signals Schemas
class AlternativeSignalsCreate(BaseModel):
    monthly_savings_rate: float = Field(..., ge=0.0, le=100.0, description="Monthly savings as a percentage of income")
    rent_delays: int = Field(..., ge=0, description="Late rent payment days in last 12 months")
    utility_delays: int = Field(..., ge=0, description="Late utility payment days in last 12 months")
    active_subscriptions: int = Field(..., ge=0, description="Count of recurring active subscriptions")
    debt_to_income: float = Field(..., ge=0.0, le=100.0, description="Debt service to gross income ratio")

class AlternativeSignalsResponse(BaseModel):
    id: int
    user_id: int
    monthly_savings_rate: float
    rent_delays: int
    utility_delays: int
    active_subscriptions: int
    debt_to_income: float
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Credit & SHAP Schemas
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

class CreditHistoryResponse(BaseModel):
    id: int
    credit_score: int
    calculated_at: datetime
    
    class Config:
        from_attributes = True

class CreditHistoryListResponse(BaseModel):
    history: List[CreditHistoryResponse]

# Chat Assessment Schemas
class ChatQuestionResponse(BaseModel):
    chat_completed: bool
    next_question_id: Optional[int] = None
    next_question_text: Optional[str] = None
    options: Optional[List[str]] = None

class ChatMessageRequest(BaseModel):
    question_id: int
    selected_option: str

class AssetAllocation(BaseModel):
    bonds: float
    etfs: float
    equities: float
    crypto: float

class ChatMessageResponse(BaseModel):
    received: bool
    chat_completed: bool
    determined_risk_tier: Optional[str] = None
    recommended_allocation: Optional[AssetAllocation] = None

# Investment Simulation Schemas
class PortfolioSimulationRequest(BaseModel):
    initial_amount: float = Field(..., ge=0.0)
    monthly_contribution: float = Field(..., ge=0.0)
    time_horizon_years: int = Field(..., ge=1, le=40)
    risk_tier: str = Field(..., pattern="^(Conservative|Moderate|Aggressive)$")

class SimulationPoint(BaseModel):
    year: int
    total_invested: float
    expected_value: float

class PortfolioSimulationResponse(BaseModel):
    total_invested: float
    future_value_conservative: float
    future_value_expected: float
    future_value_optimistic: float
    projection_data: List[SimulationPoint]
