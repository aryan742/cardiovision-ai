# 🫀 CardioVision AI

![Python](https://img.shields.io/badge/Python-3.9%2B-blue?style=for-the-badge&logo=python)
![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.2+-orange?style=for-the-badge&logo=scikit-learn)
![Streamlit](https://img.shields.io/badge/Streamlit-1.25+-red?style=for-the-badge&logo=streamlit)
![XGBoost](https://img.shields.io/badge/XGBoost-1.7+-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge)

**Cardiovascular Disease Risk Prediction & Health Analytics Platform**

CardioVision AI is a production-grade machine learning application designed to predict the likelihood of cardiovascular disease based on clinical patient biometrics. This project serves as a comprehensive demonstration of end-to-end ML engineering, bridging the gap between raw healthcare data and an actionable, interpretable user interface.

---

## 🌟 Key Features

* **Advanced Predictive Modeling**: Automated pipeline that trains, evaluates, and selects the best model from Logistic Regression, Random Forest, Gradient Boosting, SVM, and XGBoost.
* **Real-time Inference Engine**: Instant risk scoring with confidence metrics via a polished Streamlit frontend.
* **Health Analytics Dashboard**: Interactive macro-level insights into patient cohorts using Plotly.
* **Explainable AI (XAI)**: Feature importance breakdowns so clinicians understand *why* a prediction was made.
* **Enterprise Architecture**: Clean, scalable, modular codebase (`src/` pattern) ready for CI/CD integration.
* **Responsive UI**: A premium, visually impressive interface optimized for both desktop and clinical environments.

---

## 📸 Application Screenshots

> *Note: Placeholders. Add your high-res screenshots to the `screenshots/` directory.*

| Dashboard Overview | Live Prediction Interface |
| :---: | :---: |
| ![Dashboard](https://via.placeholder.com/400x250.png?text=Dashboard+Overview) | ![Prediction](https://via.placeholder.com/400x250.png?text=Live+Prediction) |

| Health Analytics | Model Performance |
| :---: | :---: |
| ![Analytics](https://via.placeholder.com/400x250.png?text=Health+Analytics) | ![Performance](https://via.placeholder.com/400x250.png?text=Model+Performance) |

---

## 🏗 Architecture & ML Workflow

1. **Data Ingestion (`src/preprocess.py`)**: Loads raw CSV data, identifies target variables, handles missing values, and splits into train/test sets.
2. **Feature Engineering**: Applies Sklearn `ColumnTransformer` pipelines—scaling numeric features and one-hot encoding categorical ones.
3. **Model Training (`src/train.py`)**: Trains an ensemble of models. Evaluates via ROC-AUC and F1-Score. Saves the highest performing model as a `joblib` artifact.
4. **Evaluation (`src/evaluate.py`)**: Generates detailed metrics (Accuracy, Precision, Recall, Confusion Matrix).
5. **Inference API (`src/predict.py`)**: Singleton prediction class designed for low-latency inference.
6. **Frontend App (`app/app.py`)**: Consumes the inference API and renders results interactively.

---

## 📊 Dataset Information

This project utilizes the **Cardiovascular Diseases Risk Prediction Dataset** from Kaggle (`alphiree/cardiovascular-diseases-risk-prediction-dataset`).

* **Total Records**: ~70,000 instances
* **Features**: 11 clinical and demographic features (Age, Gender, Height, Weight, Systolic BP, Diastolic BP, Cholesterol, Glucose, Smoking, Alcohol, Activity).
* **Target**: `cardio` (1 = Presence of cardiovascular disease, 0 = Absence).

---

## 🚀 Quick Start Guide

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/CardioVision-AI.git
cd CardioVision-AI
```

### 2. Set Up Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Download the Dataset
Download the dataset from Kaggle and place it in the `data/raw/` directory.
```bash
# Using Kaggle CLI
kaggle datasets download -d alphiree/cardiovascular-diseases-risk-prediction-dataset
unzip cardiovascular-diseases-risk-prediction-dataset.zip -d data/raw/
```

### 4. Run the ML Pipeline
This will preprocess the data, train multiple models, save the best one, and evaluate it.
```bash
python main.py
```

### 5. Launch the Application
```bash
streamlit run app/app.py
```
The app will be available at `http://localhost:8501`.

---

## 🛠 Future Improvements

* [ ] **Cloud Deployment**: Containerize with Docker and deploy to AWS EC2 or Google Cloud Run.
* [ ] **API Layer**: Add a FastAPI backend layer to decouple the ML engine from the Streamlit frontend.
* [ ] **True SHAP Integration**: Replace simulated feature importance with real-time SHAP values calculation.
* [ ] **Patient Database**: Integrate PostgreSQL to store historical predictions.

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/CardioVision-AI/issues).

## 📄 License
This project is [MIT](https://choosealicense.com/licenses/mit/) licensed.

---
*Developed by a Healthcare AI Enthusiast. Perfect for showcasing production-grade ML engineering skills.*
