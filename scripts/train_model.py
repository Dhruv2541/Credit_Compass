import os
import pickle
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report

def train_model(data_path="scripts/credit_signals.csv", model_output_path="backend/models/model.pkl"):
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Data file not found at {data_path}. Please run generate_data.py first.")
        
    df = pd.read_csv(data_path)
    
    # Feature columns and target label
    feature_cols = ["savings_rate", "rent_delays", "utility_delays", "active_subscriptions", "debt_to_income"]
    X = df[feature_cols]
    y = df["likelihood_label"]
    
    # Split datasets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    # Create training pipeline
    pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('model', LogisticRegression(
            solver='lbfgs',
            max_iter=1000,
            class_weight='balanced',
            random_state=42
        ))
    ])
    
    # Train model
    pipeline.fit(X_train, y_train)
    
    # Evaluate model
    y_pred = pipeline.predict(X_test)
    report = classification_report(y_test, y_pred, target_names=["Low", "Moderate", "High"])
    print("Classification Report:")
    print(report)
    
    # Save pipeline object
    os.makedirs(os.path.dirname(model_output_path), exist_ok=True)
    with open(model_output_path, "wb") as f:
        pickle.dump(pipeline, f)
        
    print(f"Trained model pipeline serialized and saved to {model_output_path}")

if __name__ == "__main__":
    train_model()
