import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.models import User, RiskAssessment, Portfolio
from app.schemas.schemas import (
    ChatQuestionResponse, ChatMessageRequest, ChatMessageResponse,
    PortfolioSimulationRequest, PortfolioSimulationResponse, AssetAllocation
)
from app.services.invest_service import invest_service

router = APIRouter()

@router.get("/chat/status", response_model=ChatQuestionResponse)
def get_chat_status(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Checks the progress of the user's risk profiling and serves the next question."""
    assessment = db.query(RiskAssessment).filter(RiskAssessment.user_id == current_user.id).first()
    raw_responses = {}
    if assessment and assessment.raw_responses_json:
        raw_responses = {int(k): v for k, v in json.loads(assessment.raw_responses_json).items()}
        
    status_resp = invest_service.get_chat_status(raw_responses)
    status_resp.raw_responses = {str(k): v for k, v in raw_responses.items()}
    return status_resp

@router.post("/chat/message", response_model=ChatMessageResponse)
def submit_chat_message(
    payload: ChatMessageRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submits the answer to a risk profiling question, updating the session state."""
    assessment = db.query(RiskAssessment).filter(RiskAssessment.user_id == current_user.id).first()
    if not assessment:
        assessment = RiskAssessment(user_id=current_user.id, raw_responses_json="{}", risk_tier="Moderate")
        db.add(assessment)
        db.commit()
        db.refresh(assessment)
        
    # Read existing responses
    raw_responses = json.loads(assessment.raw_responses_json)
    
    try:
        # Convert keys to int for validation compatibility
        int_responses = {int(k): v for k, v in raw_responses.items()}
        
        # Process options
        result = invest_service.process_answer(
            int_responses, payload.question_id, payload.selected_option
        )
        
        # Update database responses
        raw_responses[str(payload.question_id)] = payload.selected_option
        assessment.raw_responses_json = json.dumps(raw_responses)
        
        # If complete, finalize risk tier and save recommended portfolio
        if result.chat_completed:
            assessment.risk_tier = result.determined_risk_tier
            
            # Save portfolio record
            portfolio = db.query(Portfolio).filter(Portfolio.user_id == current_user.id).first()
            if not portfolio:
                portfolio = Portfolio(user_id=current_user.id)
                db.add(portfolio)
                
            alloc = result.recommended_allocation
            portfolio.risk_tier = result.determined_risk_tier
            portfolio.allocation_bonds = alloc.bonds
            portfolio.allocation_etfs = alloc.etfs
            portfolio.allocation_equities = alloc.equities
            portfolio.allocation_crypto = alloc.crypto
            
        db.commit()
        return result
        
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post("/simulate", response_model=PortfolioSimulationResponse)
def simulate_portfolio(
    payload: PortfolioSimulationRequest,
    current_user: User = Depends(get_current_user)
):
    """Calculates yearly compounded wealth trajectories based on user inputs."""
    return invest_service.simulate_portfolio(
        initial=payload.initial_amount,
        monthly=payload.monthly_contribution,
        years=payload.time_horizon_years,
        risk_tier=payload.risk_tier
    )

@router.get("/portfolio", response_model=AssetAllocation)
def get_user_portfolio(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieves the recommended asset allocation matching the user's risk profile."""
    portfolio = (
        db.query(Portfolio)
        .filter(Portfolio.user_id == current_user.id)
        .order_by(Portfolio.assigned_at.desc())
        .first()
    )
    if not portfolio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio not assigned. Complete the risk assessment questionnaire first."
        )
    return AssetAllocation(
        bonds=portfolio.allocation_bonds,
        etfs=portfolio.allocation_etfs,
        equities=portfolio.allocation_equities,
        crypto=portfolio.allocation_crypto
    )

@router.post("/chat/reset", response_model=ChatQuestionResponse)
def reset_chat_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Resets the risk profiling assessment state, allowing the user to restart."""
    assessment = db.query(RiskAssessment).filter(RiskAssessment.user_id == current_user.id).first()
    if assessment:
        assessment.raw_responses_json = "{}"
        assessment.risk_tier = "Moderate"
        
    portfolio = db.query(Portfolio).filter(Portfolio.user_id == current_user.id).first()
    if portfolio:
        db.delete(portfolio)
        
    db.commit()
    return ChatQuestionResponse(
        chat_completed=False,
        next_question_id=QUESTIONS[0]["id"],
        next_question_text=QUESTIONS[0]["text"],
        options=QUESTIONS[0]["options"],
        raw_responses={}
    )
# Import QUESTIONS for reset route
from app.services.invest_service import QUESTIONS
