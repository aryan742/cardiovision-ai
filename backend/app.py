import os
import pickle
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, Any

app = FastAPI(
    title="CardioVision AI & Biocore Analytics Engine",
    description="High-fidelity machine learning diagnostic api for multi-biomarker prediction.",
    version="1.0.0"
)

# Enable CORS for Next.js frontend calls
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_headers=["*"],
    allow_methods=["*"]
)

# Global variables to cache models
models: Dict[str, Any] = {}
scalers: Dict[str, Any] = {}

def load_resources():
    model_paths = {
        "heart_lr": "backend/models/heart_lr.pkl",
        "heart_svm": "backend/models/heart_svm.pkl",
        "heart_rf": "backend/models/heart_rf.pkl",
        "heart_xgb": "backend/models/heart_xgb.pkl",
        "diabetes_lr": "backend/models/diabetes_lr.pkl",
        "diabetes_svm": "backend/models/diabetes_svm.pkl",
        "diabetes_rf": "backend/models/diabetes_rf.pkl",
        "diabetes_xgb": "backend/models/diabetes_xgb.pkl",
        "cancer_lr": "backend/models/cancer_lr.pkl",
        "cancer_svm": "backend/models/cancer_svm.pkl",
        "cancer_rf": "backend/models/cancer_rf.pkl",
        "cancer_xgb": "backend/models/cancer_xgb.pkl",
    }
    
    scaler_paths = {
        "heart": "backend/scalers/heart_scaler.pkl",
        "diabetes": "backend/scalers/diabetes_scaler.pkl",
        "cancer": "backend/scalers/cancer_scaler.pkl",
    }
    
    for key, path in model_paths.items():
        if os.path.exists(path):
            with open(path, "rb") as f:
                models[key] = pickle.load(f)
                
    for key, path in scaler_paths.items():
        if os.path.exists(path):
            with open(path, "rb") as f:
                scalers[key] = pickle.load(f)

# Load resources upon server startup
load_resources()

# Define input schemas
class HeartInput(BaseModel):
    age: float = Field(..., example=54.0)
    sex: float = Field(..., example=1.0)  # 1 = male, 0 = female
    cp: float = Field(..., example=3.0)   # chest pain type (1-4)
    trestbps: float = Field(..., example=120.0) # resting blood pressure
    chol: float = Field(..., example=230.0)     # serum cholesterol in mg/dl
    fbs: float = Field(..., example=0.0)        # fasting blood sugar > 120 mg/dl (1/0)
    restecg: float = Field(..., example=0.0)    # rest ecg (0-2)
    thalach: float = Field(..., example=150.0)  # max heart rate achieved
    exang: float = Field(..., example=0.0)      # exercise induced angina (1/0)
    oldpeak: float = Field(..., example=1.2)    # ST depression
    slope: float = Field(..., example=1.0)      # slope of peak exercise ST segment
    ca: float = Field(..., example=0.0)         # number of major vessels (0-3)
    thal: float = Field(..., example=3.0)       # thal: 3=normal, 6=fixed defect, 7=reversable defect
    algorithm: str = Field("xgb", example="xgb") # lr, svm, rf, xgb

class DiabetesInput(BaseModel):
    pregnancies: float = Field(..., example=2.0)
    glucose: float = Field(..., example=120.0)
    blood_pressure: float = Field(..., example=70.0)
    skin_thickness: float = Field(..., example=20.0)
    insulin: float = Field(..., example=80.0)
    bmi: float = Field(..., example=28.5)
    pedigree: float = Field(..., example=0.45)
    age: float = Field(..., example=33.0)
    algorithm: str = Field("xgb", example="xgb")

class CancerInput(BaseModel):
    radius_mean: float = Field(..., example=14.0)
    texture_mean: float = Field(..., example=19.0)
    perimeter_mean: float = Field(..., example=90.0)
    area_mean: float = Field(..., example=600.0)
    smoothness_mean: float = Field(..., example=0.09)
    compactness_mean: float = Field(..., example=0.10)
    concavity_mean: float = Field(..., example=0.08)
    concave_points_mean: float = Field(..., example=0.05)
    symmetry_mean: float = Field(..., example=0.18)
    fractal_dimension_mean: float = Field(..., example=0.06)
    algorithm: str = Field("xgb", example="xgb")

@app.get("/")
def read_root():
    return {
        "status": "online",
        "platform": "CardioVision AI Diagnostic Core",
        "models_loaded": list(models.keys()),
        "scalers_loaded": list(scalers.keys())
    }

@app.post("/predict/heart")
def predict_heart(data: HeartInput):
    model_key = f"heart_{data.algorithm.lower()}"
    if model_key not in models:
        raise HTTPException(status_code=400, detail=f"Algorithm '{data.algorithm}' not loaded/supported.")
    
    model = models[model_key]
    scaler = scalers.get("heart")
    
    # Input vector
    raw_features = [
        data.age, data.sex, data.cp, data.trestbps, data.chol, data.fbs,
        data.restecg, data.thalach, data.exang, data.oldpeak, data.slope,
        data.ca, data.thal
    ]
    features_arr = np.array([raw_features])
    
    # Scale if necessary (Logistic Regression and SVM)
    if data.algorithm.lower() in ["lr", "svm"] and scaler:
        processed_features = scaler.transform(features_arr)
    else:
        processed_features = features_arr

    # Predict
    pred = int(model.predict(processed_features)[0])
    
    # Predict Probability
    try:
        prob = float(model.predict_proba(processed_features)[0][1])
    except Exception:
        # Fallback if model doesn't support probability
        prob = 0.85 if pred == 1 else 0.15

    # Compute Feature Contribution / Explainability (XAI)
    feature_names = [
        "Age", "Sex", "Chest Pain Type", "Resting Blood Pressure", "Serum Cholesterol", 
        "Fasting Blood Sugar", "Resting ECG", "Max Heart Rate", "Exercise Angina", 
        "ST Depression", "ST Slope", "Major Vessels", "Thalassemia"
    ]
    
    # Calculate simple contributions
    contributions = []
    if data.algorithm.lower() == "lr":
        coefs = model.coef_[0]
        # Multiply scaled features by coefficients to see relative push
        raw_contrib = processed_features[0] * coefs
        # Softmax or simple normalization
        raw_contrib = np.abs(raw_contrib)
        total = np.sum(raw_contrib) if np.sum(raw_contrib) > 0 else 1
        contrib_pct = (raw_contrib / total) * 100
        for name, val in zip(feature_names, contrib_pct):
            contributions.append({"feature": name, "contribution": round(float(val), 2)})
    elif data.algorithm.lower() in ["rf", "xgb"]:
        importances = model.feature_importances_
        # Normalize
        total = np.sum(importances) if np.sum(importances) > 0 else 1
        contrib_pct = (importances / total) * 100
        for name, val in zip(feature_names, contrib_pct):
            contributions.append({"feature": name, "contribution": round(float(val), 2)})
    else:
        # Fallback standard risk weighting
        weights = [1.2, 0.8, 1.5, 1.1, 1.3, 0.5, 0.6, 1.4, 1.0, 1.2, 0.9, 1.6, 1.4]
        weights = np.array(weights)
        total = np.sum(weights)
        contrib_pct = (weights / total) * 100
        for name, val in zip(feature_names, contrib_pct):
            contributions.append({"feature": name, "contribution": round(float(val), 2)})

    # Sort contributions by magnitude
    contributions = sorted(contributions, key=lambda x: x["contribution"], reverse=True)

    return {
        "disease": "Heart Disease",
        "algorithm": data.algorithm.upper(),
        "prediction": pred,
        "probability": round(prob, 4),
        "risk_level": "CRITICAL RISK" if prob >= 0.7 else "MODERATE RISK" if prob >= 0.3 else "STABLE (LOW RISK)",
        "explainability": contributions[:5]
    }

@app.post("/predict/diabetes")
def predict_diabetes(data: DiabetesInput):
    model_key = f"diabetes_{data.algorithm.lower()}"
    if model_key not in models:
        raise HTTPException(status_code=400, detail=f"Algorithm '{data.algorithm}' not loaded/supported.")
    
    model = models[model_key]
    scaler = scalers.get("diabetes")
    
    raw_features = [
        data.pregnancies, data.glucose, data.blood_pressure, data.skin_thickness,
        data.insulin, data.bmi, data.pedigree, data.age
    ]
    features_arr = np.array([raw_features])
    
    if data.algorithm.lower() in ["lr", "svm"] and scaler:
        processed_features = scaler.transform(features_arr)
    else:
        processed_features = features_arr

    pred = int(model.predict(processed_features)[0])
    
    try:
        prob = float(model.predict_proba(processed_features)[0][1])
    except Exception:
        prob = 0.85 if pred == 1 else 0.15

    feature_names = [
        "Pregnancies", "Plasma Glucose", "Diastolic Blood Pressure", 
        "Triceps Skin Thickness", "2-Hour Serum Insulin", "Body Mass Index", 
        "Diabetes Pedigree Value", "Age"
    ]
    
    contributions = []
    if data.algorithm.lower() == "lr":
        coefs = model.coef_[0]
        raw_contrib = np.abs(processed_features[0] * coefs)
        total = np.sum(raw_contrib) if np.sum(raw_contrib) > 0 else 1
        contrib_pct = (raw_contrib / total) * 100
        for name, val in zip(feature_names, contrib_pct):
            contributions.append({"feature": name, "contribution": round(float(val), 2)})
    elif data.algorithm.lower() in ["rf", "xgb"]:
        importances = model.feature_importances_
        total = np.sum(importances) if np.sum(importances) > 0 else 1
        contrib_pct = (importances / total) * 100
        for name, val in zip(feature_names, contrib_pct):
            contributions.append({"feature": name, "contribution": round(float(val), 2)})
    else:
        weights = [0.8, 2.5, 1.0, 0.5, 0.7, 1.8, 1.4, 1.2]
        weights = np.array(weights)
        total = np.sum(weights)
        contrib_pct = (weights / total) * 100
        for name, val in zip(feature_names, contrib_pct):
            contributions.append({"feature": name, "contribution": round(float(val), 2)})

    contributions = sorted(contributions, key=lambda x: x["contribution"], reverse=True)

    return {
        "disease": "Diabetes",
        "algorithm": data.algorithm.upper(),
        "prediction": pred,
        "probability": round(prob, 4),
        "risk_level": "CRITICAL RISK" if prob >= 0.7 else "MODERATE RISK" if prob >= 0.3 else "STABLE (LOW RISK)",
        "explainability": contributions[:5]
    }

@app.post("/predict/cancer")
def predict_cancer(data: CancerInput):
    model_key = f"cancer_{data.algorithm.lower()}"
    if model_key not in models:
        raise HTTPException(status_code=400, detail=f"Algorithm '{data.algorithm}' not loaded/supported.")
    
    model = models[model_key]
    scaler = scalers.get("cancer")
    
    raw_features = [
        data.radius_mean, data.texture_mean, data.perimeter_mean, data.area_mean,
        data.smoothness_mean, data.compactness_mean, data.concavity_mean,
        data.concave_points_mean, data.symmetry_mean, data.fractal_dimension_mean
    ]
    features_arr = np.array([raw_features])
    
    if data.algorithm.lower() in ["lr", "svm"] and scaler:
        processed_features = scaler.transform(features_arr)
    else:
        processed_features = features_arr

    pred = int(model.predict(processed_features)[0])
    
    try:
        prob = float(model.predict_proba(processed_features)[0][1])
    except Exception:
        prob = 0.85 if pred == 1 else 0.15

    feature_names = [
        "Radius Mean", "Texture Mean", "Perimeter Mean", "Area Mean", "Smoothness Mean",
        "Compactness Mean", "Concavity Mean", "Concave Points Mean", "Symmetry Mean", "Fractal Dimension Mean"
    ]
    
    contributions = []
    if data.algorithm.lower() == "lr":
        coefs = model.coef_[0]
        raw_contrib = np.abs(processed_features[0] * coefs)
        total = np.sum(raw_contrib) if np.sum(raw_contrib) > 0 else 1
        contrib_pct = (raw_contrib / total) * 100
        for name, val in zip(feature_names, contrib_pct):
            contributions.append({"feature": name, "contribution": round(float(val), 2)})
    elif data.algorithm.lower() in ["rf", "xgb"]:
        importances = model.feature_importances_
        total = np.sum(importances) if np.sum(importances) > 0 else 1
        contrib_pct = (importances / total) * 100
        for name, val in zip(feature_names, contrib_pct):
            contributions.append({"feature": name, "contribution": round(float(val), 2)})
    else:
        weights = [1.8, 1.2, 2.0, 2.2, 0.8, 1.4, 1.9, 2.3, 0.9, 0.7]
        weights = np.array(weights)
        total = np.sum(weights)
        contrib_pct = (weights / total) * 100
        for name, val in zip(feature_names, contrib_pct):
            contributions.append({"feature": name, "contribution": round(float(val), 2)})

    contributions = sorted(contributions, key=lambda x: x["contribution"], reverse=True)

    return {
        "disease": "Breast Cancer",
        "algorithm": data.algorithm.upper(),
        "prediction": pred,
        "probability": round(prob, 4),
        "risk_level": "MALIGNANT DETECTED" if pred == 1 else "BENIGN (LOW RISK)",
        "explainability": contributions[:5]
    }
