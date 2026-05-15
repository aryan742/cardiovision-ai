import os
import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from src.utils import setup_logger, get_project_root

logger = setup_logger('preprocess')

def load_data(filepath):
    """Load dataset from csv."""
    logger.info(f"Loading data from {filepath}")
    try:
        df = pd.read_csv(filepath)
        logger.info(f"Successfully loaded dataset with shape: {df.shape}")
        return df
    except Exception as e:
        logger.error(f"Error loading data: {str(e)}")
        raise

def identify_target_column(df):
    """Identify the target column from common names."""
    possible_targets = ['cardio', 'target', 'risk', 'disease', 'HeartDisease']
    for col in possible_targets:
        if col in df.columns:
            logger.info(f"Identified target column: {col}")
            return col
    
    # If not found, assume the last column
    target = df.columns[-1]
    logger.warning(f"Target column not explicitly found. Using the last column: {target}")
    return target

def build_preprocessor(numeric_features, categorical_features):
    """Build a robust sklearn ColumnTransformer."""
    numeric_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])

    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('encoder', OneHotEncoder(handle_unknown='ignore'))
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numeric_features),
            ('cat', categorical_transformer, categorical_features)
        ])
    
    return preprocessor

def run_preprocessing_pipeline(data_path, output_dir, test_size=0.2, random_state=42):
    """Run the complete preprocessing pipeline."""
    df = load_data(data_path)
    
    target_col = identify_target_column(df)
    
    # Drop IDs if present
    if 'id' in df.columns.str.lower():
        id_col = df.columns[df.columns.str.lower() == 'id'][0]
        df = df.drop(columns=[id_col])
        logger.info(f"Dropped ID column: {id_col}")

    X = df.drop(columns=[target_col])
    y = df[target_col]
    
    numeric_features = X.select_dtypes(include=['int64', 'float64']).columns.tolist()
    categorical_features = X.select_dtypes(include=['object', 'category', 'bool']).columns.tolist()
    
    logger.info(f"Numeric features ({len(numeric_features)}): {numeric_features}")
    logger.info(f"Categorical features ({len(categorical_features)}): {categorical_features}")
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size, random_state=random_state, stratify=y)
    logger.info(f"Train shape: {X_train.shape}, Test shape: {X_test.shape}")
    
    # Preprocessing
    preprocessor = build_preprocessor(numeric_features, categorical_features)
    
    X_train_processed = preprocessor.fit_transform(X_train)
    X_test_processed = preprocessor.transform(X_test)
    
    # Extract feature names if possible for later interpretation
    try:
        cat_features_out = preprocessor.named_transformers_['cat']['encoder'].get_feature_names_out(categorical_features)
        all_features = numeric_features + list(cat_features_out)
    except Exception:
        all_features = [f"feature_{i}" for i in range(X_train_processed.shape[1])]
    
    # Save artifacts
    os.makedirs(output_dir, exist_ok=True)
    joblib.dump(preprocessor, os.path.join(output_dir, 'preprocessor.pkl'))
    joblib.dump(all_features, os.path.join(output_dir, 'feature_names.pkl'))
    
    # Save processed arrays
    np.save(os.path.join(output_dir, 'X_train.npy'), X_train_processed)
    np.save(os.path.join(output_dir, 'X_test.npy'), X_test_processed)
    np.save(os.path.join(output_dir, 'y_train.npy'), y_train.to_numpy())
    np.save(os.path.join(output_dir, 'y_test.npy'), y_test.to_numpy())
    
    logger.info("Preprocessing complete. Artifacts saved to models/ directory.")
    
    return X_train_processed, X_test_processed, y_train, y_test, preprocessor, all_features

if __name__ == "__main__":
    root = get_project_root()
    data_path = os.path.join(root, 'data', 'raw', 'dataset.csv')
    output_dir = os.path.join(root, 'models')
    
    if os.path.exists(data_path):
        run_preprocessing_pipeline(data_path, output_dir)
    else:
        logger.error(f"Dataset not found at {data_path}. Please place the dataset there.")
