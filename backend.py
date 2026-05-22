from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sys
import os

# Add root to sys path
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from src.predict import CardioRiskPredictor

app = FastAPI(title="CardioVision AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

predictor = CardioRiskPredictor()

class PatientData(BaseModel):
    age: float
    gender: int
    height: float
    weight: float
    ap_hi: float
    ap_lo: float
    cholesterol: int
    gluc: int
    smoke: int
    alco: int
    active: int

@app.post("/api/predict")
def predict_risk(data: PatientData):
    result = predictor.predict(data.dict())
    return result

@app.get("/api/health")
def health_check():
    return {"status": "online"}
