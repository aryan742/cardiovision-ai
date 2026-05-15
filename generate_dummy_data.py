import pandas as pd
import numpy as np
import os

# Create dummy data that matches the Kaggle dataset structure
np.random.seed(42)
n_samples = 1000

data = {
    'id': np.arange(n_samples),
    'age': np.random.randint(14000, 24000, n_samples), # Age in days
    'gender': np.random.choice([1, 2], n_samples),
    'height': np.random.normal(165, 10, n_samples).astype(int),
    'weight': np.random.normal(75, 15, n_samples).round(1),
    'ap_hi': np.random.normal(120, 20, n_samples).astype(int),
    'ap_lo': np.random.normal(80, 10, n_samples).astype(int),
    'cholesterol': np.random.choice([1, 2, 3], n_samples, p=[0.7, 0.2, 0.1]),
    'gluc': np.random.choice([1, 2, 3], n_samples, p=[0.8, 0.15, 0.05]),
    'smoke': np.random.choice([0, 1], n_samples, p=[0.8, 0.2]),
    'alco': np.random.choice([0, 1], n_samples, p=[0.9, 0.1]),
    'active': np.random.choice([0, 1], n_samples, p=[0.2, 0.8]),
}

df = pd.DataFrame(data)

# Generate a synthetic target variable with some loose correlations
prob = (df['ap_hi'] > 130).astype(int) * 0.3 + \
       (df['cholesterol'] > 1).astype(int) * 0.2 + \
       (df['age'] > 18000).astype(int) * 0.2 + \
       (df['weight'] > 85).astype(int) * 0.1 + \
       np.random.uniform(0, 0.2, n_samples)

df['cardio'] = (prob > 0.4).astype(int)

# Ensure directory exists
os.makedirs('data/raw', exist_ok=True)

# Save to CSV
df.to_csv('data/raw/cardio_dummy.csv', index=False)
print("Created dummy dataset at data/raw/cardio_dummy.csv")
