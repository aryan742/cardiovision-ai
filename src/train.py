import os
import numpy as np
import joblib
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.svm import SVC
from xgboost import XGBClassifier
from sklearn.metrics import roc_auc_score, f1_score
from src.utils import setup_logger, get_project_root

logger = setup_logger('train')

def load_processed_data(models_dir):
    logger.info("Loading preprocessed data...")
    X_train = np.load(os.path.join(models_dir, 'X_train.npy'))
    y_train = np.load(os.path.join(models_dir, 'y_train.npy'))
    X_test = np.load(os.path.join(models_dir, 'X_test.npy'))
    y_test = np.load(os.path.join(models_dir, 'y_test.npy'))
    return X_train, y_train, X_test, y_test

def train_and_evaluate_models(X_train, y_train, X_test, y_test):
    models = {
        'Logistic Regression': LogisticRegression(max_iter=1000, random_state=42),
        'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42),
        'Gradient Boosting': GradientBoostingClassifier(n_estimators=100, random_state=42),
        'SVM': SVC(probability=True, random_state=42),
        'XGBoost': XGBClassifier(use_label_encoder=False, eval_metric='logloss', random_state=42)
    }

    best_model_name = None
    best_model = None
    best_score = 0
    results = {}

    for name, model in models.items():
        logger.info(f"Training {name}...")
        model.fit(X_train, y_train)
        
        preds = model.predict(X_test)
        
        # Determine score
        score = f1_score(y_test, preds, average='weighted')
        try:
            probas = model.predict_proba(X_test)[:, 1]
            auc = roc_auc_score(y_test, probas)
        except Exception:
            auc = score # fallback
            
        logger.info(f"{name} - F1 Score: {score:.4f}, AUC: {auc:.4f}")
        results[name] = {'f1': score, 'auc': auc}
        
        if auc > best_score:
            best_score = auc
            best_model_name = name
            best_model = model

    logger.info(f"Best model selected: {best_model_name} with AUC: {best_score:.4f}")
    return best_model, best_model_name, results

def run_training_pipeline(models_dir):
    X_train, y_train, X_test, y_test = load_processed_data(models_dir)
    best_model, best_name, _ = train_and_evaluate_models(X_train, y_train, X_test, y_test)
    
    model_path = os.path.join(models_dir, 'best_model.pkl')
    joblib.dump(best_model, model_path)
    logger.info(f"Saved best model ({best_name}) to {model_path}")
    
    # Save model info
    info = {'model_name': best_name}
    joblib.dump(info, os.path.join(models_dir, 'model_info.pkl'))
    
    return best_model

if __name__ == "__main__":
    root = get_project_root()
    models_dir = os.path.join(root, 'models')
    
    if os.path.exists(os.path.join(models_dir, 'X_train.npy')):
        run_training_pipeline(models_dir)
    else:
        logger.error("Preprocessed data not found. Run preprocess.py first.")
