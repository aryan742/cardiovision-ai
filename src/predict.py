import os
import joblib
import pandas as pd
from src.utils import setup_logger, get_project_root

logger = setup_logger('predict')

class CardioRiskPredictor:
    def __init__(self, models_dir=None):
        if models_dir is None:
            models_dir = os.path.join(get_project_root(), 'models')
            
        self.preprocessor_path = os.path.join(models_dir, 'preprocessor.pkl')
        self.model_path = os.path.join(models_dir, 'best_model.pkl')
        
        self.preprocessor = None
        self.model = None
        self.is_loaded = False
        
    def load_artifacts(self):
        if not os.path.exists(self.preprocessor_path) or not os.path.exists(self.model_path):
            raise FileNotFoundError(f"Model artifacts not found in {os.path.dirname(self.model_path)}. Please train the model first.")
            
        self.preprocessor = joblib.load(self.preprocessor_path)
        self.model = joblib.load(self.model_path)
        self.is_loaded = True
        logger.info("Successfully loaded preprocessor and model.")

    def predict(self, input_data: dict):
        """
        Predict cardiovascular risk.
        input_data should be a dictionary matching the feature names of the training data.
        """
        if not self.is_loaded:
            self.load_artifacts()
            
        # Convert to DataFrame
        df = pd.DataFrame([input_data])
        
        # Preprocess
        try:
            X_processed = self.preprocessor.transform(df)
        except Exception as e:
            logger.error(f"Error during preprocessing: {str(e)}")
            raise ValueError(f"Input features do not match expected schema. Error: {str(e)}")
            
        # Predict
        prediction = self.model.predict(X_processed)[0]
        
        # Predict probability
        try:
            probabilities = self.model.predict_proba(X_processed)[0]
            confidence = float(max(probabilities))
            risk_prob = float(probabilities[1]) if len(probabilities) > 1 else float(prediction)
        except AttributeError:
            # Model doesn't support probability
            confidence = 1.0
            risk_prob = float(prediction)
            
        risk_level = "High Risk" if prediction == 1 else "Low Risk"
        if 0.4 <= risk_prob < 0.6:
            risk_level = "Medium Risk"
            
        result = {
            'prediction': int(prediction),
            'risk_level': risk_level,
            'confidence': round(confidence * 100, 2),
            'risk_probability': round(risk_prob * 100, 2)
        }
        
        return result

# Singleton instance for easy import
predictor = CardioRiskPredictor()

def make_prediction(input_data):
    return predictor.predict(input_data)
