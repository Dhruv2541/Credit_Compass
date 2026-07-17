import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.models import User, AlternativeSignals, CreditPrediction
from app.schemas.schemas import (
    AlternativeSignalsCreate, AlternativeSignalsResponse,
    CreditScoreResponse, CreditHistoryListResponse, CreditHistoryResponse
)
from app.services.credit_service import credit_service

router = APIRouter()

@router.post("/predict", response_model=CreditScoreResponse)
def predict_credit(
    signals_in: AlternativeSignalsCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Saves or updates alternative financial metrics, executes the ML classifier pipeline,
    generates SHAP attributions, and archives the resulting score.
    """
    # 1. Save or update alternative signals for the user
    signals = db.query(AlternativeSignals).filter(AlternativeSignals.user_id == current_user.id).first()
    if not signals:
        signals = AlternativeSignals(user_id=current_user.id)
        db.add(signals)
        
    signals.monthly_savings_rate = signals_in.monthly_savings_rate
    signals.rent_delays = signals_in.rent_delays
    signals.utility_delays = signals_in.utility_delays
    signals.active_subscriptions = signals_in.active_subscriptions
    signals.debt_to_income = signals_in.debt_to_income
    
    db.commit()
    db.refresh(signals)
    
    # 2. Run prediction model + SHAP calculations
    signals_dict = {
        "savings_rate": signals.monthly_savings_rate,
        "rent_delays": signals.rent_delays,
        "utility_delays": signals.utility_delays,
        "active_subscriptions": signals.active_subscriptions,
        "debt_to_income": signals.debt_to_income
    }
    
    prediction_result = credit_service.run_prediction(current_user.id, signals_dict)
    
    # 3. Archive prediction output
    shap_json = json.dumps([impact.model_dump() for impact in prediction_result.top_impacts])
    prediction_record = CreditPrediction(
        user_id=current_user.id,
        credit_score=prediction_result.credit_score,
        probability=prediction_result.credit_score / 850.0,  # Proxy probability metric
        shap_contributions_json=shap_json
    )
    db.add(prediction_record)
    db.commit()
    
    return prediction_result

@router.get("/history", response_model=CreditHistoryListResponse)
def get_credit_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieves all previously calculated and saved credit score logs for this user."""
    records = (
        db.query(CreditPrediction)
        .filter(CreditPrediction.user_id == current_user.id)
        .order_by(CreditPrediction.calculated_at.asc())
        .all()
    )
    
    history_list = [
        CreditHistoryResponse(
            id=rec.id,
            credit_score=rec.credit_score,
            calculated_at=rec.calculated_at
        ) for rec in records
    ]
    return CreditHistoryListResponse(history=history_list)

@router.get("/signals", response_model=AlternativeSignalsResponse)
def get_current_signals(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieves the active alternative signals sheet submitted by this user."""
    signals = db.query(AlternativeSignals).filter(AlternativeSignals.user_id == current_user.id).first()
    if not signals:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alternative signals have not been submitted yet."
        )
    return signals
