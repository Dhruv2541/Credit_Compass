import json
from typing import List, Dict, Any, Optional
from app.schemas.schemas import (
    ChatQuestionResponse, ChatMessageResponse, AssetAllocation,
    PortfolioSimulationResponse, SimulationPoint
)

QUESTIONS = [
    {
        "id": 1,
        "text": "What is your primary financial objective?",
        "options": [
            "Protect my savings against inflation (Low risk)",
            "Grow my savings steadily over time (Balanced)",
            "Maximize returns with aggressive growth (High risk)"
        ]
    },
    {
        "id": 2,
        "text": "What is your planned investment horizon?",
        "options": [
            "Short term: Less than 2 years",
            "Medium term: 2 to 7 years",
            "Long term: More than 7 years"
        ]
    },
    {
        "id": 3,
        "text": "How would you react if your portfolio fell 10% in a month?",
        "options": [
            "Sell everything immediately to prevent further loss",
            "Do nothing and wait for the market to recover",
            "Buy more assets at the lower price"
        ]
    },
    {
        "id": 4,
        "text": "What percentage of your income can you comfortably allocate to investing?",
        "options": [
            "Under 5% of monthly income",
            "5% to 15% of monthly income",
            "Over 15% of monthly income"
        ]
    },
    {
        "id": 5,
        "text": "How would you rate your knowledge of financial markets?",
        "options": [
            "Beginner: I don't know much about stocks/bonds",
            "Intermediate: I understand core concepts (mutual funds, ETFs)",
            "Advanced: I actively track and trade assets"
        ]
    }
]

class InvestmentService:
    def get_chat_status(self, raw_responses: Dict[int, str]) -> ChatQuestionResponse:
        """Determines current chat state and yields the next question or completion indicator."""
        answered_count = len(raw_responses)
        
        if answered_count >= len(QUESTIONS):
            return ChatQuestionResponse(chat_completed=True)
            
        next_q = QUESTIONS[answered_count]
        return ChatQuestionResponse(
            chat_completed=False,
            next_question_id=next_q["id"],
            next_question_text=next_q["text"],
            options=next_q["options"]
        )

    def process_answer(self, raw_responses: Dict[int, str], new_question_id: int, selected_option: str) -> ChatMessageResponse:
        """Saves response and calculates risk allocations if the questionnaire is complete."""
        # Validate selected option is valid for the question
        target_q = next((q for q in QUESTIONS if q["id"] == new_question_id), None)
        if not target_q or selected_option not in target_q["options"]:
            raise ValueError("Invalid question ID or selected option.")
            
        # Update session responses
        updated_responses = {**raw_responses, new_question_id: selected_option}
        completed = len(updated_responses) >= len(QUESTIONS)
        
        if not completed:
            return ChatMessageResponse(received=True, chat_completed=False)
            
        # Evaluate risk level on completion
        # Option 1 (Index 0) = 1 pt, Option 2 (Index 1) = 2 pts, Option 3 (Index 2) = 3 pts
        total_pts = 0
        for q in QUESTIONS:
            ans = updated_responses.get(q["id"])
            if ans in q["options"]:
                idx = q["options"].index(ans)
                total_pts += (idx + 1)
                
        avg_score = total_pts / len(QUESTIONS)
        
        if avg_score <= 1.6:
            risk_tier = "Conservative"
            allocation = AssetAllocation(bonds=60.0, etfs=30.0, equities=10.0, crypto=0.0)
        elif avg_score <= 2.4:
            risk_tier = "Moderate"
            allocation = AssetAllocation(bonds=30.0, etfs=50.0, equities=15.0, crypto=5.0)
        else:
            risk_tier = "Aggressive"
            allocation = AssetAllocation(bonds=10.0, etfs=30.0, equities=40.0, crypto=20.0)
            
        return ChatMessageResponse(
            received=True,
            chat_completed=True,
            determined_risk_tier=risk_tier,
            recommended_allocation=allocation
        )

    def simulate_portfolio(self, initial: float, monthly: float, years: int, risk_tier: str) -> PortfolioSimulationResponse:
        """Runs monthly compounding growth simulation projections across time horizons."""
        # Establish rates of return based on risk profile
        rates = {
            "Conservative": {"expected": 0.05, "low": 0.03, "high": 0.07},
            "Moderate": {"expected": 0.08, "low": 0.05, "high": 0.11},
            "Aggressive": {"expected": 0.12, "low": 0.08, "high": 0.16}
        }
        
        r_set = rates.get(risk_tier, rates["Moderate"])
        
        points = []
        # Calculate year-by-year snapshots
        for y in range(years + 1):
            total_invested = initial + (monthly * 12 * y)
            
            # Expected compounding
            r_exp = r_set["expected"]
            if r_exp == 0:
                expected_val = total_invested
            else:
                expected_val = initial * ((1 + r_exp / 12) ** (12 * y)) + monthly * (((1 + r_exp / 12) ** (12 * y) - 1) / (r_exp / 12))
                
            points.append(SimulationPoint(
                year=y,
                total_invested=round(total_invested, 2),
                expected_value=round(expected_val, 2)
            ))
            
        # Final future values
        r_low = r_set["low"]
        r_high = r_set["high"]
        
        fv_cons = initial * ((1 + r_low / 12) ** (12 * years)) + monthly * (((1 + r_low / 12) ** (12 * years) - 1) / (r_low / 12))
        fv_opt = initial * ((1 + r_high / 12) ** (12 * years)) + monthly * (((1 + r_high / 12) ** (12 * years) - 1) / (r_high / 12))
        
        return PortfolioSimulationResponse(
            total_invested=round(initial + (monthly * 12 * years), 2),
            future_value_conservative=round(fv_cons, 2),
            future_value_expected=round(points[-1].expected_value, 2),
            future_value_optimistic=round(fv_opt, 2),
            projection_data=points
        )

# Singleton service instance
invest_service = InvestmentService()
