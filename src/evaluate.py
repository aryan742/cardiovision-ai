import os
import numpy as np
import joblib
import pandas as pd
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix
from src.utils import setup_logger, get_project_root

logger = setup_logger('evaluate')

def evaluate_model(models_dir):
    logger.info("Loading evaluation data and model...")
    X_test = np.load(os.path.join(models_dir, 'X_test.npy'))
    y_test = np.load(os.path.join(models_dir, 'y_test.npy'))
    
    model_path = os.path.join(models_dir, 'best_model.pkl')
    if not os.path.exists(model_path):
        logger.error(f"Model not found at {model_path}")
        return
        
    model = joblib.load(model_path)
    model_info = joblib.load(os.path.join(models_dir, 'model_info.pkl'))
    model_name = model_info.get('model_name', 'Unknown Model')
    
    logger.info(f"Evaluating {model_name}...")
    
    preds = model.predict(X_test)
    
    try:
        probas = model.predict_proba(X_test)[:, 1]
    except AttributeError:
        probas = preds
        
    acc = accuracy_score(y_test, preds)
    prec = precision_score(y_test, preds, average='weighted', zero_division=0)
    rec = recall_score(y_test, preds, average='weighted', zero_division=0)
    f1 = f1_score(y_test, preds, average='weighted', zero_division=0)
    
    try:
        auc = roc_auc_score(y_test, probas)
    except Exception:
        auc = 0.0
        
    cm = confusion_matrix(y_test, preds)
    
    metrics = {
        'Accuracy': float(acc),
        'Precision': float(prec),
        'Recall': float(rec),
        'F1-Score': float(f1),
        'ROC-AUC': float(auc)
    }
    
    logger.info("Evaluation Metrics:")
    for k, v in metrics.items():
        logger.info(f"  {k}: {v:.4f}")
        
    logger.info(f"Confusion Matrix:\n{cm}")
    
    # Save metrics
    pd.DataFrame([metrics]).to_csv(os.path.join(models_dir, 'metrics.csv'), index=False)
    logger.info("Metrics saved to models/metrics.csv")
    
    return metrics

if __name__ == "__main__":
    root = get_project_root()
    models_dir = os.path.join(root, 'models')
    evaluate_model(models_dir)
