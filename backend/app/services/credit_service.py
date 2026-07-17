import os
import pickle
import numpy as np
from typing import List, Dict, Any
from app.schemas.schemas import ShapImpact, CreditScoreResponse

class CreditService:
    def __init__(self, model_path: str = "backend/models/model.pkl"):
        self.model_path = model_path
        self.pipeline = None
        self.scaler = None
        self.model = None
        self.load_model()
        
    def load_model(self):
        """Loads the serialized model pipeline from disk."""
        if os.path.exists(self.model_path):
            try:
                with open(self.model_path, "rb") as f:
                    self.pipeline = pickle.load(f)
                self.scaler = self.pipeline.named_steps['scaler']
                self.model = self.pipeline.named_steps['model']
                print("Model pipeline loaded successfully.")
            except Exception as e:
                print(f"Error loading model from {self.model_path}: {e}")
                self.pipeline = None
        else:
            print(f"Model file not found at {self.model_path}. Using fallback heuristic rules.")

    def run_prediction(self, user_id: int, signals_dict: Dict[str, Any]) -> CreditScoreResponse:
        """
        Executes ML pipeline. Computes score, probability class, and SHAP feature impacts.
        """
        features = ["savings_rate", "rent_delays", "utility_delays", "active_subscriptions", "debt_to_income"]
        input_vector = [signals_dict[f] for f in features]
        
        # Check if we should use fallback heuristics
        if self.pipeline is None or self.model is None or self.scaler is None:
            return self._fallback_prediction(user_id, signals_dict)
            
        try:
            # 1. Scaling & Prediction
            X_input = np.array([input_vector])
            X_scaled = self.scaler.transform(X_input)
            
            # Predict probabilities for classes: [Low (0), Moderate (1), High (2)]
            probs = self.model.predict_proba(X_scaled)[0]
            
            # Calculate a smooth credit score (300 to 850) based on weighted average of probabilities
            # score = 300 + 550 * (0.0 * P(Low) + 0.5 * P(Mod) + 1.0 * P(High))
            weighted_prob = 0.5 * probs[1] + 1.0 * probs[2]
            credit_score = int(300 + 550 * weighted_prob)
            credit_score = max(300, min(850, credit_score))
            
            # Determine probability class
            pred_class_idx = int(np.argmax(probs))
            classes = ["Low Likelihood", "Moderate Likelihood", "High Likelihood"]
            prob_class = classes[pred_class_idx]
            
            # 2. SHAP Explainability (LinearExplainer equivalence for LogisticRegression)
            # For multinomial logistic regression, class 2 (High) coefficients represent positive credit signals.
            # SHAP value = coef_i * (x_scaled_i - mean_scaled_i)
            # Let's compute it using the model coefficients directly for class 2.
            coefs = self.model.coef_[2]  # Coefficients for the 'High Likelihood' class
            
            top_impacts = []
            descriptions = {
                "savings_rate": "Your monthly savings rate of {val:.1f}%.",
                "rent_delays": "A total of {val:d} late rent payments in the last 12 months.",
                "utility_delays": "A total of {val:d} late utility payments in the last 12 months.",
                "active_subscriptions": "Having {val:d} recurring active subscription payments.",
                "debt_to_income": "A debt-to-income ratio of {val:.1f}%."
            }
            
            # Calculate impacts
            for idx, feature in enumerate(features):
                val = signals_dict[feature]
                impact = coefs[idx] * X_scaled[0][idx]
                direction = "positive" if impact >= 0 else "negative"
                
                # Format description text based on direction
                desc_template = descriptions[feature]
                if feature == "savings_rate":
                    desc = f"{desc_template.format(val=val)} {'boosts your credit index' if direction == 'positive' else 'is lower than ideal, reducing your index'}."
                elif feature in ["rent_delays", "utility_delays"]:
                    desc = f"{desc_template.format(val=val)} {'keeps your payment history clean' if val == 0 else 'introduces delinquency marks, lowering your index'}."
                elif feature == "active_subscriptions":
                    desc = f"{desc_template.format(val=val)} {'helps demonstrate recurring cash outflow consistency' if val <= 4 else 'indicates higher monthly subscription outflows, slightly reducing score stability'}."
                else: # debt_to_income
                    desc = f"{desc_template.format(val=val)} {'represents a low debt profile, boosting creditworthiness' if val < 25 else 'indicates high leverage relative to income, reducing score stability'}."
                
                top_impacts.append(ShapImpact(
                    feature=feature,
                    impact_value=float(impact),
                    direction=direction,
                    description=desc
                ))
            
            # Sort impacts by absolute influence value
            top_impacts.sort(key=lambda x: abs(x.impact_value), reverse=True)
            
            return CreditScoreResponse(
                user_id=user_id,
                credit_score=credit_score,
                probability_class=prob_class,
                top_impacts=top_impacts
            )
            
        except Exception as e:
            print(f"Prediction failed, falling back to heuristics: {e}")
            return self._fallback_prediction(user_id, signals_dict)
            
    def _fallback_prediction(self, user_id: int, signals: Dict[str, Any]) -> CreditScoreResponse:
        """Fallback rule-based scorer if ML pipeline is unavailable."""
        # Simple heuristic formula
        score = 600
        score += int(3.5 * signals["savings_rate"])
        score -= int(25.0 * signals["rent_delays"])
        score -= int(15.0 * signals["utility_delays"])
        score -= int(2.0 * signals["active_subscriptions"])
        score -= int(3.0 * signals["debt_to_income"])
        
        credit_score = max(300, min(850, score))
        
        if credit_score < 500:
            prob_class = "Low Likelihood"
        elif credit_score < 600:
            prob_class = "Moderate Likelihood"
        else:
            prob_class = "High Likelihood"
            
        features = ["savings_rate", "rent_delays", "utility_delays", "active_subscriptions", "debt_to_income"]
        top_impacts = []
        for feature in features:
            val = signals[feature]
            if feature == "savings_rate":
                direction = "positive" if val >= 15 else "negative"
                desc = f"Monthly savings rate is {val:.1f}%, which {'helps build credit confidence' if direction == 'positive' else 'could be increased to support score improvement'}."
            elif feature == "rent_delays":
                direction = "positive" if val == 0 else "negative"
                desc = f"Had {val} late rent payments. {'Excellent payment consistency.' if direction == 'positive' else 'Prioritize early payments to improve score.'}"
            elif feature == "utility_delays":
                direction = "positive" if val == 0 else "negative"
                desc = f"Had {val} late utility payments. {'Clean history.' if direction == 'positive' else 'Paying utility bills on time boosts score.'}"
            elif feature == "active_subscriptions":
                direction = "positive" if val <= 4 else "negative"
                desc = f"Active subscriptions count: {val}. {'Manageable count.' if direction == 'positive' else 'Reducing active subscriptions increases saving capacity.'}"
            else:
                direction = "positive" if val < 25 else "negative"
                desc = f"Debt-to-income is {val:.1f}%. {'Comfortable debt load.' if direction == 'positive' else 'High debt ratio increases risk profile.'}"
                
            top_impacts.append(ShapImpact(
                feature=feature,
                impact_value=1.5 if direction == "positive" else -1.5,
                direction=direction,
                description=desc
            ))
            
        return CreditScoreResponse(
            user_id=user_id,
            credit_score=credit_score,
            probability_class=prob_class,
            top_impacts=top_impacts
        )

# Singleton service instance
credit_service = CreditService()
