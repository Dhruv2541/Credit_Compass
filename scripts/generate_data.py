import os
import numpy as np
import pandas as pd

def generate_synthetic_data(num_samples=5000, output_path="scripts/credit_signals.csv"):
    np.random.seed(42)
    
    # 1. savings_rate: Normal distribution around 18% with standard deviation 7%, clipped between 0 and 100
    savings_rate = np.random.normal(18, 7, num_samples)
    savings_rate = np.clip(savings_rate, 0, 100)
    
    # 2. rent_delays: Poisson distribution with lambda=2.0 (most pay on time, some are late)
    rent_delays = np.random.poisson(2.0, num_samples)
    
    # 3. utility_delays: Poisson distribution with lambda=1.5
    utility_delays = np.random.poisson(1.5, num_samples)
    
    # 4. active_subscriptions: Normal distribution around 6 with standard deviation 3, clipped at 0
    active_subscriptions = np.random.normal(6, 3, num_samples).astype(int)
    active_subscriptions = np.clip(active_subscriptions, 0, 20)
    
    # 5. debt_to_income: Normal distribution around 25% with standard dev 10%, clipped between 0 and 100
    debt_to_income = np.random.normal(25, 10, num_samples)
    debt_to_income = np.clip(debt_to_income, 0, 100)
    
    # Calculate an underlying credit score rating (between 300 and 850)
    # Higher savings rate is good. More delays and higher debt-to-income is bad.
    # Subscriptions slightly lower it (cash outflow) but can represent regular payments if positive,
    # let's make it slightly negative for outflow but neutral overall.
    base_score = 600
    score_mod = (
        5.5 * savings_rate -
        15.0 * rent_delays -
        10.0 * utility_delays -
        2.0 * active_subscriptions -
        4.0 * debt_to_income
    )
    
    # Add random noise
    noise = np.random.normal(0, 25, num_samples)
    final_scores = base_score + score_mod + noise
    final_scores = np.clip(final_scores, 300, 850).astype(int)
    
    # Map score to likelihood labels:
    # Score < 500: Low Likelihood (0)
    # 500 <= Score < 600: Moderate Likelihood (1)
    # Score >= 600: High Likelihood (2)
    likelihood_label = np.zeros(num_samples, dtype=int)
    likelihood_label[(final_scores >= 500) & (final_scores < 600)] = 1
    likelihood_label[final_scores >= 600] = 2
    
    # Assemble dataframe
    df = pd.DataFrame({
        "savings_rate": savings_rate,
        "rent_delays": rent_delays,
        "utility_delays": utility_delays,
        "active_subscriptions": active_subscriptions,
        "debt_to_income": debt_to_income,
        "credit_score": final_scores,
        "likelihood_label": likelihood_label
    })
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"Synthesized dataset saved to {output_path}")
    print(df["likelihood_label"].value_counts())

if __name__ == "__main__":
    generate_synthetic_data()
