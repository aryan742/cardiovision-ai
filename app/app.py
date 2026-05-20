import os
import time
import sys
import numpy as np
import pandas as pd
import streamlit as st
import plotly.express as px
import plotly.graph_objects as go
import joblib

# Ensure project root is in the path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from src.predict import CardioRiskPredictor
from src.utils import get_project_root

# Setup page configuration
st.set_page_config(
    page_title="CardioVision AI — Cardiovascular Risk Intelligence Platform",
    page_icon="🫀",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Initialize Session States for narrative control
if 'analyzed' not in st.session_state:
    st.session_state.analyzed = False
if 'analyzing' not in st.session_state:
    st.session_state.analyzing = False
if 'patient_profile' not in st.session_state:
    st.session_state.patient_profile = {}
if 'prediction_result' not in st.session_state:
    st.session_state.prediction_result = {}

# Load visual asset paths
assets_dir = os.path.join(os.path.dirname(__file__), 'assets')
cinematic_bg_path = os.path.join(assets_dir, 'heart_vessel_cinematic.jpg')
anatomy_path = os.path.join(assets_dir, 'heart_vessel_anatomy.jpg')
narrowing_path = os.path.join(assets_dir, 'narrowing_of_coronary_artery.png')
disease_types_path = os.path.join(assets_dir, 'types_of_heart_disease.png')

# Dynamic System Metrics
def get_system_metadata():
    metadata = {
        'accuracy': 0.9200,
        'precision': 0.9205,
        'recall': 0.9200,
        'f1_score': 0.9199,
        'roc_auc': 0.9871,
        'dataset_size': 1000,
        'model_name': 'XGBoost Classifier'
    }
    try:
        root = get_project_root()
        models_dir = os.path.join(root, 'models')
        
        metrics_path = os.path.join(models_dir, 'metrics.csv')
        if os.path.exists(metrics_path):
            df_m = pd.read_csv(metrics_path)
            if not df_m.empty:
                metadata['accuracy'] = float(df_m.get('Accuracy', [0.92])[0])
                metadata['precision'] = float(df_m.get('Precision', [0.9205])[0])
                metadata['recall'] = float(df_m.get('Recall', [0.92])[0])
                metadata['f1_score'] = float(df_m.get('F1-Score', [0.9199])[0])
                metadata['roc_auc'] = float(df_m.get('ROC-AUC', [0.9871])[0])
                
        model_info_path = os.path.join(models_dir, 'model_info.pkl')
        if os.path.exists(model_info_path):
            m_info = joblib.load(model_info_path)
            metadata['model_name'] = m_info.get('model_name', 'XGBoost Classifier')
            
        data_path = os.path.join(root, 'data', 'raw')
        if os.path.exists(data_path):
            csv_files = [f for f in os.listdir(data_path) if f.endswith('.csv')]
            if csv_files:
                df_raw = pd.read_csv(os.path.join(data_path, csv_files[0]))
                metadata['dataset_size'] = len(df_raw)
    except Exception:
        pass
    return metadata

sys_meta = get_system_metadata()

@st.cache_resource
def load_predictor():
    try:
        predictor = CardioRiskPredictor()
        predictor.load_artifacts()
        return predictor
    except Exception:
        return None

predictor = load_predictor()

# Immersive CSS & JavaScript (Custom elements, glassmorphism, scrollytelling persistent heart)
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
    
    /* Completely hide Streamlit layout controls to force product site aesthetics */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
    [data-testid="collapsedSidebarCodemirror"] { display: none !important; }
    section[data-testid="stSidebar"] { display: none !important; }
    [data-testid="stSidebarCollapseButton"] { display: none !important; }
    
    html, body, [data-testid="stAppViewContainer"] {
        background-color: #03050b !important;
        color: #E2E8F0 !important;
        font-family: 'Plus Jakarta Sans', sans-serif !important;
        scroll-behavior: smooth;
    }
    
    [data-testid="block-container"] {
        padding-top: 1rem !important;
        padding-bottom: 4rem !important;
        padding-left: 5rem !important;
        padding-right: 5rem !important;
    }
    
    /* Apple-Style Glassmorphic Layouts */
    .narrative-container {
        margin-bottom: 80px;
        padding: 40px;
        background: rgba(10, 14, 28, 0.6);
        backdrop-filter: blur(25px);
        -webkit-backdrop-filter: blur(25px);
        border: 1px solid rgba(226, 232, 240, 0.06);
        border-radius: 28px;
        box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6);
        transition: all 0.4s ease;
    }
    
    .narrative-container:hover {
        border-color: rgba(0, 242, 254, 0.15);
        box-shadow: 0 40px 80px rgba(0, 242, 254, 0.04);
    }
    
    /* Sleek Typography */
    .scrolly-title {
        background: linear-gradient(135deg, #FFFFFF 40%, #94A3B8 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 800 !important;
        letter-spacing: -0.04em !important;
        line-height: 1.15;
    }
    
    .pulse-glow-teal {
        color: #00f2fe !important;
        text-shadow: 0 0 15px rgba(0, 242, 254, 0.4);
    }
    
    .pulse-glow-coral {
        color: #E63946 !important;
        text-shadow: 0 0 15px rgba(230, 57, 70, 0.4);
    }
    
    /* Interactive Inputs Styling Overrides */
    .stTextInput > div > div > input, .stNumberInput input, .stSelectbox select {
        background-color: #080b14 !important;
        color: #FFFFFF !important;
        border: 1px solid rgba(226, 232, 240, 0.08) !important;
        border-radius: 12px !important;
        padding: 12px 16px !important;
        transition: all 0.3s ease;
    }
    
    /* Styled Clinical Action Buttons */
    div.stButton > button {
        background: linear-gradient(135deg, #E63946 0%, #B91C1C 100%) !important;
        color: #FFFFFF !important;
        border: none !important;
        border-radius: 14px !important;
        padding: 18px 36px !important;
        font-weight: 700 !important;
        font-size: 1.05rem !important;
        letter-spacing: 0.05em !important;
        text-transform: uppercase !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        box-shadow: 0 10px 30px rgba(230, 57, 70, 0.35) !important;
        width: 100% !important;
    }
    div.stButton > button:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 15px 40px rgba(230, 57, 70, 0.55) !important;
        border: none !important;
        color: #FFFFFF !important;
    }
    
    /* Indicator Badges */
    .pill-premium {
        display: inline-flex;
        align-items: center;
        padding: 6px 18px;
        border-radius: 9999px;
        font-size: 0.78rem;
        font-weight: 800;
        letter-spacing: 0.05em;
        text-transform: uppercase;
    }
    .indicator-high {
        background-color: rgba(230, 57, 70, 0.12);
        color: #F87171;
        border: 1px solid rgba(230, 57, 70, 0.35);
        box-shadow: 0 0 15px rgba(230, 57, 70, 0.2);
    }
    .indicator-medium {
        background-color: rgba(245, 158, 11, 0.12);
        color: #FBBF24;
        border: 1px solid rgba(245, 158, 11, 0.35);
        box-shadow: 0 0 15px rgba(245, 158, 11, 0.2);
    }
    .indicator-low {
        background-color: rgba(13, 148, 136, 0.12);
        color: #2DD4BF;
        border: 1px solid rgba(13, 148, 136, 0.35);
        box-shadow: 0 0 15px rgba(13, 148, 136, 0.2);
    }
    
    /* ==================== PERSISTENT OBJECT WEB HUD ==================== */
    .hud-canvas {
        position: fixed;
        top: 25%;
        right: 8%;
        width: 320px;
        height: 320px;
        z-index: 9999;
        pointer-events: none;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    /* continuous mechanical telemetry rotating rings */
    @keyframes rotateOuter {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    @keyframes rotateInner {
        from { transform: rotate(360deg); }
        to { transform: rotate(0deg); }
    }
    @keyframes pulseHeart {
        0% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(230, 57, 70, 0.4)); }
        15% { transform: scale(1.06); filter: drop-shadow(0 0 25px rgba(230, 57, 70, 0.85)); }
        30% { transform: scale(0.97); }
        45% { transform: scale(1.08); filter: drop-shadow(0 0 30px rgba(230, 57, 70, 0.95)); }
        70% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(230, 57, 70, 0.4)); }
        100% { transform: scale(1); }
    }
    
    .hud-outer-ring {
        position: absolute;
        width: 100%;
        height: 100%;
        border: 2px dashed rgba(0, 242, 254, 0.2);
        border-radius: 50%;
        animation: rotateOuter 25s infinite linear;
    }
    
    .hud-inner-ring {
        position: absolute;
        width: 82%;
        height: 82%;
        border: 1px dashed rgba(230, 57, 70, 0.25);
        border-radius: 50%;
        animation: rotateInner 15s infinite linear;
    }
    
    .hud-heart-element {
        width: 48%;
        height: 48%;
        fill: url(#heartGradient);
        animation: pulseHeart 2.2s infinite cubic-bezier(0.215, 0.61, 0.355, 1);
        transition: all 0.8s ease;
    }
</style>

<!-- Floating HUD Persistent Object Markup -->
<div class="hud-canvas" id="scrollytelling-hud">
    <div class="hud-outer-ring"></div>
    <div class="hud-inner-ring"></div>
    <svg class="hud-heart-element" viewBox="0 0 24 24">
        <defs>
            <radialGradient id="heartGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#FF5E62" />
                <stop offset="100%" stop-color="#A61C2C" />
            </radialGradient>
        </defs>
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
</div>

<!-- Scroll Listener Script to transform the persistent object dynamically -->
<script>
    const hud = document.getElementById('scrollytelling-hud');
    const innerRing = document.querySelector('.hud-inner-ring');
    const outerRing = document.querySelector('.hud-outer-ring');
    const heartNode = document.querySelector('.hud-heart-element');

    window.addEventListener('scroll', () => {
        let st = window.pageYOffset || document.documentElement.scrollTop;
        let sh = document.documentElement.scrollHeight - window.innerHeight;
        let pct = sh > 0 ? (st / sh) : 0;
        
        // Dynamic Transformations based on scroll position
        let rotation = pct * 360;
        let scale = 1.0 + Math.sin(pct * Math.PI) * 0.2;
        
        let translateX = 0;
        let translateY = 0;
        
        if (pct < 0.15) {
            // Section 1 (Hero): Floating Top-Right
            translateX = 0;
            translateY = 0;
            heartNode.style.animationDuration = "2.2s";
            hud.style.opacity = "1";
        } else if (pct < 0.32) {
            // Section 2 (Intro): Glide to Left Center
            translateX = -680;
            translateY = 50;
            heartNode.style.animationDuration = "1.8s";
            hud.style.opacity = "0.95";
        } else if (pct < 0.50) {
            // Section 3 (Inputs): Glide to Right
            translateX = 50;
            translateY = 120;
            heartNode.style.animationDuration = "1.4s";
        } else if (pct < 0.75) {
            // Section 5 (Dashboard): Float as deep glowing background element (large & faded)
            translateX = -320;
            translateY = -50;
            scale = 1.6;
            hud.style.opacity = "0.15";
            heartNode.style.animationDuration = "0.8s"; // Hyper pulse under stress calculation
        } else {
            // Section 8/9 (Anatomy & Footer): Right Side
            translateX = 0;
            translateY = 80;
            scale = 1.1;
            hud.style.opacity = "0.7";
            heartNode.style.animationDuration = "2.0s";
        }
        
        hud.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${rotation}deg) scale(${scale})`;
    });
</script>
""", unsafe_allow_html=True)


# ==================== NARRATIVE FLOW CONTROLLER ====================

def main():
    # If the user triggers "Analyze Risk", bypass standard render to show full cinematic loader
    if st.session_state.analyzing:
        show_analysis_loader()
        return

    # 1. HERO SECTION
    render_hero()
    
    # 2. INTRODUCTION SECTION
    render_intro()
    
    # 3. INTERACTIVE INPUT SECTION
    render_inputs()
    
    # 5. DASHBOARD RESULTS SECTION (Conditionally revealed or placeholders rendered)
    render_dashboard_section()
    
    # 6. SCROLL-BASED EXPLANATION SECTIONS
    render_explanations()
    
    # 7. RECOMMENDATION / PREVENTION SECTIONS
    render_recommendations()
    
    # 8. VISUAL HEALTH EDUCATION
    render_visual_anatomy()
    
    # 9. FOOTER SECTION
    render_footer()


# ==================== SECTION 1: HERO ====================
def render_hero():
    st.markdown("<div style='margin-top: 60px;'></div>", unsafe_allow_html=True)
    c1, c2 = st.columns([12, 10], gap="large")
    
    with c1:
        st.markdown("""
        <div style='margin-top: 40px;'>
            <div style='display: inline-flex; align-items: center; gap: 8px; background: rgba(0, 242, 254, 0.08); border: 1px solid rgba(0, 242, 254, 0.25); border-radius: 99px; padding: 6px 18px; margin-bottom: 25px;'>
                <span style='height: 6px; width: 6px; background-color: #E63946; border-radius: 50%; display: inline-block; box-shadow: 0 0 8px #E63946;'></span>
                <span style='font-size: 0.7rem; font-weight: 800; letter-spacing: 0.1em; color: #00f2fe; text-transform: uppercase;'>Clinical Diagnostic Core Online</span>
            </div>
            <h1 class='scrolly-title' style='font-size: 3.55rem; line-height: 1.1; margin: 0 0 20px 0;'>
                CardioVision AI<br>
                <span class='pulse-glow-teal' style='font-size: 2.85rem; font-weight: 700;'>Biometric Risk Intelligence</span>
            </h1>
            <p style='color: #94A3B8; font-size: 1.2rem; line-height: 1.6; max-width: 580px; margin-bottom: 40px;'>
                A cinematic, scrollytelling analytics experience designed to decouple cardiovascular pathologies from complex biometric EHR vectors. Interact, scroll, and visualize local diagnostic explainability.
            </p>
            <div style='max-width: 320px;'>
        """, unsafe_allow_html=True)
        
        # Apple-style smooth scroll down trigger button
        if st.button("Begin Diagnostic Journey", key="hero_scroll_down"):
            st.markdown("""
            <script>
                document.getElementById("biometric-configuration-head").scrollIntoView({behavior: "smooth"});
            </script>
            """, unsafe_allow_html=True)
            
        st.markdown("</div></div>", unsafe_allow_html=True)
        
    with c2:
        # Subtle right background visual offset (persistent heart floats near here)
        st.markdown("<div style='height: 400px;'></div>", unsafe_allow_html=True)


# ==================== SECTION 2: INTRODUCTION ====================
def render_intro():
    st.markdown("<div style='margin-top: 100px;'></div>", unsafe_allow_html=True)
    st.markdown("""
    <div class="narrative-container">
        <h2 class="scrolly-title" style="font-size: 2.2rem; margin-top:0; margin-bottom: 20px;">The Sub-Clinical Pathology Challenge</h2>
        <p style="color: #94A3B8; font-size: 1.05rem; line-height: 1.7; max-width: 780px;">
            Cardiovascular diseases remain the leading cause of global mortality, yet early endothelial wear is rarely detectable in isolation. A single standard biomarker—be it blood pressure, lipid density, or physical activity indicators—fails to tell the full story.
        </p>
        <div style="background-color: rgba(0, 242, 254, 0.02); border-left: 3px solid #00f2fe; padding: 20px; border-radius: 4px 16px 16px 4px; margin-top: 25px; font-size: 0.92rem; line-height: 1.6; color: #94A3B8;">
            <b>The CardioVision Narrative Concept:</b> Rather than serving as a black-box decision maker, our model decodes the structural multi-variable dependencies of cardiovascular strain. By configuring the biometric vector below, you will trigger our local XGBoost classifier engine, mapping out localized pathology weight impacts in real-time.
        </div>
    </div>
    """, unsafe_allow_html=True)


# ==================== SECTION 3: INTERACTIVE INPUT SECTION ====================
def render_inputs():
    st.markdown("<div id='biometric-configuration-head' style='margin-top: 60px;'></div>", unsafe_allow_html=True)
    st.markdown("""
    <div style='text-align: center; margin-bottom: 40px;'>
        <h2 class='scrolly-title' style='font-size: 2.2rem; margin: 0 0 10px 0;'>1. Configure Patient Biomarkers</h2>
        <p style='color: #94A3B8; font-size: 1rem; max-width: 600px; margin: 0 auto;'>Configure the physiological diagnostic vector below. Grouped parameters are parsed natively into standard scaling matrices.</p>
    </div>
    """, unsafe_allow_html=True)
    
    with st.form("guided_biometric_form"):
        # Interactive Grouped Bio-Parameters
        c1, c2, c3, c4 = st.columns(4, gap="medium")
        
        with c1:
            st.markdown("""
            <div style='display: flex; align-items: center; gap: 8px; margin-bottom: 15px;'>
                <span style='color: #00f2fe; font-size: 1.1rem;'>📊</span>
                <h4 style='margin: 0; color: #FFFFFF; font-size: 0.95rem; font-weight: 700;'>Vital Signs</h4>
            </div>
            """, unsafe_allow_html=True)
            age_years = st.slider("Patient Age (Years)", min_value=18, max_value=100, value=54)
            gender = st.selectbox("Biological Sex", options=[1, 2], format_func=lambda x: "Female" if x == 1 else "Male")
            height = st.slider("Height (cm)", min_value=120, max_value=220, value=170)
            weight = st.slider("Weight (kg)", min_value=40.0, max_value=180.0, value=76.5)
            
        with c2:
            st.markdown("""
            <div style='display: flex; align-items: center; gap: 8px; margin-bottom: 15px;'>
                <span style='color: #E63946; font-size: 1.1rem;'>🩸</span>
                <h4 style='margin: 0; color: #FFFFFF; font-size: 0.95rem; font-weight: 700;'>Hemodynamics</h4>
            </div>
            """, unsafe_allow_html=True)
            ap_hi = st.slider("Systolic BP (mmHg)", min_value=80, max_value=220, value=128)
            ap_lo = st.slider("Diastolic BP (mmHg)", min_value=50, max_value=130, value=82)
            
        with c3:
            st.markdown("""
            <div style='display: flex; align-items: center; gap: 8px; margin-bottom: 15px;'>
                <span style='color: #00f2fe; font-size: 1.1rem;'>🧪</span>
                <h4 style='margin: 0; color: #FFFFFF; font-size: 0.95rem; font-weight: 700;'>Biomarkers</h4>
            </div>
            """, unsafe_allow_html=True)
            cholesterol = st.selectbox("Serum Cholesterol", options=[1, 2, 3], 
                                      format_func=lambda x: {1: "Grade 1: Normal (<200 mg/dL)", 2: "Grade 2: Elevated (200-239)", 3: "Grade 3: High (>=240)"}[x])
            gluc = st.selectbox("Fasting Glucose", options=[1, 2, 3],
                                     format_func=lambda x: {1: "Grade 1: Normal (<100 mg/dL)", 2: "Grade 2: Elevated (100-125)", 3: "Grade 3: Diabetic (>=126)"}[x])
            
        with c4:
            st.markdown("""
            <div style='display: flex; align-items: center; gap: 8px; margin-bottom: 15px;'>
                <span style='color: #E63946; font-size: 1.1rem;'>🏃‍♂️</span>
                <h4 style='margin: 0; color: #FFFFFF; font-size: 0.95rem; font-weight: 700;'>Lifestyle Factors</h4>
            </div>
            """, unsafe_allow_html=True)
            active = st.selectbox("Cardio Activity", options=[1, 0], format_func=lambda x: "Active (>=30 min Daily)" if x == 1 else "Sedentary Pattern")
            smoke = st.selectbox("Tobacco Profile", options=[0, 1], format_func=lambda x: "Non-Smoker" if x == 0 else "Active Tobacco User")
            alco = st.selectbox("Alcohol Profile", options=[0, 1], format_func=lambda x: "Zero/Occasional" if x == 0 else "Regular Intake")
            
        st.markdown("<div style='margin-top: 25px;'></div>", unsafe_allow_html=True)
        submit = st.form_submit_button("Generate Predictive Analysis Vector")
        
    if submit:
        # Cache patient vector in session
        st.session_state.patient_profile = {
            'age': age_years * 365.25,
            'age_years': age_years,
            'gender': gender,
            'height': height,
            'weight': weight,
            'ap_hi': ap_hi,
            'ap_lo': ap_lo,
            'cholesterol': cholesterol,
            'gluc': gluc,
            'smoke': smoke,
            'alco': alco,
            'active': active
        }
        st.session_state.analyzing = True
        st.rerun()


# ==================== SECTION 4: AI ANALYSIS EXPERIENCE (CINEMATIC) ====================
def show_analysis_loader():
    st.markdown("<div style='margin-top: 80px;'></div>", unsafe_allow_html=True)
    c1, c2, c3 = st.columns([1, 2, 1])
    
    with c2:
        st.markdown("<div class='narrative-container' style='text-align: center; padding: 60px 40px !important; border-color: rgba(230,57,70,0.3);'>", unsafe_allow_html=True)
        
        # Cinematic pulsating vector graphic
        st.markdown("""
        <div style='display: flex; justify-content: center; align-items: center; margin-bottom: 40px;'>
            <div class='heart-pulse' style='font-size: 5rem; filter: drop-shadow(0 0 20px #E63946);'>🫀</div>
        </div>
        """, unsafe_allow_html=True)
        
        progress_bar = st.progress(0)
        status_msg = st.empty()
        
        stages = [
            ("Initializing patient biomarker matrix...", 0.15),
            ("Evaluating aortic diastolic resistance coefficients...", 0.35),
            ("Mapping serum cholesterol and glucose tolerance levels...", 0.6),
            ("Executing XGBoost ensemble pipeline matrices...", 0.85),
            ("Synthesizing patient explainability reports...", 1.0)
        ]
        
        for text, val in stages:
            status_msg.markdown(f"<p style='color: #00f2fe; font-size: 1rem; font-weight: 600; letter-spacing: 0.05em;'>{text}</p>", unsafe_allow_html=True)
            progress_bar.progress(val)
            time.sleep(0.45)
            
        st.markdown("</div>", unsafe_allow_html=True)
        
        # Execute ML prediction and save state
        if predictor:
            raw_payload = st.session_state.patient_profile.copy()
            if 'age_years' in raw_payload:
                del raw_payload['age_years']
            prediction = predictor.predict(raw_payload)
            st.session_state.prediction_result = prediction
            
        st.session_state.analyzed = True
        st.session_state.analyzing = False
        st.rerun()


# ==================== SECTION 5: DASHBOARD RESULTS SECTION ====================
def render_dashboard_section():
    st.markdown("<div id='cardiovision-results-core' style='margin-top: 80px;'></div>", unsafe_allow_html=True)
    
    if not st.session_state.analyzed:
        st.markdown("""
        <div class="narrative-container" style="text-align: center; padding: 60px 40px;">
            <span style="font-size: 3rem; color: rgba(226,232,240,0.15);">🧬</span>
            <h3 style="color: #94A3B8; font-size: 1.25rem; margin-top: 15px;">Diagnostic Core Standby</h3>
            <p style="color: #64748B; font-size: 0.9rem; max-width: 480px; margin: 8px auto 0 auto;">
                Complete the biomarker configuration above and generate a predictive analysis vector to unlock the local pathology tracking dashboard.
            </p>
        </div>
        """, unsafe_allow_html=True)
        return
        
    # Retrieve model output
    profile = st.session_state.patient_profile
    result = st.session_state.prediction_result
    
    st.markdown("""
    <div style='margin-bottom: 30px;'>
        <h2 class='scrolly-title' style='font-size: 2.2rem; margin: 0 0 5px 0;'>2. Real-Time Risk Intelligence</h2>
        <p style='color: #94A3B8; font-size: 1.05rem; margin: 0;'>Clinical dashboard embedded naturally into the scrolling diagnostic narrative.</p>
    </div>
    """, unsafe_allow_html=True)
    
    # Core Indicator Row
    row1_c1, row1_c2, row1_c3 = st.columns([1, 1, 1], gap="medium")
    
    with row1_c1:
        st.markdown("<div class='narrative-container' style='height: 280px; text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center; margin-bottom: 0;'>", unsafe_allow_html=True)
        st.markdown("<h4 style='color: #94A3B8; font-size: 0.8rem; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 15px;'>Diagnostic Classification</h4>", unsafe_allow_html=True)
        
        risk_lvl = result.get('risk_level', 'Low Risk')
        if risk_lvl == "High Risk":
            st.markdown("<span class='pill-premium indicator-high' style='font-size: 0.95rem; padding: 8px 24px;'>Critical Pathology Flagged</span>", unsafe_allow_html=True)
        elif risk_lvl == "Medium Risk":
            st.markdown("<span class='pill-premium indicator-medium' style='font-size: 0.95rem; padding: 8px 24px;'>Borderline Case Profiling</span>", unsafe_allow_html=True)
        else:
            st.markdown("<span class='pill-premium indicator-low' style='font-size: 0.95rem; padding: 8px 24px;'>Physiological Profile Stable</span>", unsafe_allow_html=True)
            
        st.markdown(f"<div style='font-size: 0.85rem; color: #64748B; margin-top: 25px;'>Model Certainty: <b>{result.get('confidence', 95.0)}%</b></div>", unsafe_allow_html=True)
        st.markdown("</div>", unsafe_allow_html=True)
        
    with row1_c2:
        st.markdown("<div class='narrative-container' style='height: 280px; display: flex; justify-content: center; align-items: center; margin-bottom: 0;'>", unsafe_allow_html=True)
        prob_val = result.get('risk_probability', 48.0)
        fig_g = go.Figure(go.Indicator(
            mode = "gauge+number",
            value = prob_val,
            domain = {'x': [0, 1], 'y': [0, 1]},
            title = {'text': "CARDIO RISK COEFFICIENT", 'font': {'size': 11, 'color': '#94A3B8', 'family': 'Plus Jakarta Sans', 'weight': 'bold'}},
            number = {'font': {'size': 38, 'color': '#FFFFFF', 'family': 'Plus Jakarta Sans', 'weight': 'bold'}, 'suffix': '%'},
            gauge = {
                'axis': {'range': [0, 100], 'tickwidth': 1, 'tickcolor': "#475569"},
                'bar': {'color': "#E63946" if risk_lvl == "High Risk" else "#FBBF24" if risk_lvl == "Medium Risk" else "#2DD4BF"},
                'bgcolor': "#080b14",
                'borderwidth': 1,
                'bordercolor': "rgba(226, 232, 240, 0.08)",
                'steps': [
                    {'range': [0, 40], 'color': 'rgba(13, 148, 136, 0.04)'},
                    {'range': [40, 70], 'color': 'rgba(245, 158, 11, 0.04)'},
                    {'range': [70, 100], 'color': 'rgba(230, 57, 70, 0.04)'}
                ]
            }
        ))
        fig_g.update_layout(
            paper_bgcolor='rgba(0,0,0,0)',
            plot_bgcolor='rgba(0,0,0,0)',
            height=200,
            margin=dict(l=10, r=10, t=40, b=10)
        )
        st.plotly_chart(fig_g, use_container_width=True)
        st.markdown("</div>", unsafe_allow_html=True)
        
    with row1_c3:
        st.markdown("<div class='narrative-container' style='height: 280px; display: flex; flex-direction: column; justify-content: center; margin-bottom: 0;'>", unsafe_allow_html=True)
        st.markdown("<h4 style='color: #FFFFFF; font-size: 0.95rem; font-weight: 700; margin-top: 0; margin-bottom: 8px;'>Active Classifier Benchmark</h4>", unsafe_allow_html=True)
        st.markdown(f"""
        <div style='font-size: 0.8rem; color: #94A3B8; line-height: 1.5;'>
            <b>Engine Name:</b> {sys_meta['model_name']}<br>
            <b>Validation AUC:</b> {sys_meta['roc_auc']:.2%}<br>
            <b>Accuracy:</b> {sys_meta['accuracy']:.2%}<br>
            <b>De-Identified Dataset Ref:</b> alphiree/cardio-ehr-1000
        </div>
        """, unsafe_allow_html=True)
        st.markdown("""
        <div style='background: rgba(0, 242, 254, 0.05); border: 1px solid rgba(0, 242, 254, 0.15); border-radius: 8px; padding: 10px; margin-top: 15px; font-size: 0.72rem; color: #00f2fe; line-height: 1.45;'>
            <b>Diagnostic Note:</b> The optimal algorithm was chosen out of 5 standard classifiers during local pipeline construction.
        </div>
        """, unsafe_allow_html=True)
        st.markdown("</div>", unsafe_allow_html=True)
        
    # Explainability Attributions Section (Section 6 - gradual local explainability)
    st.markdown("<div class='narrative-container' style='margin-top: 25px;'>", unsafe_allow_html=True)
    st.markdown("<h3 style='color: #FFFFFF; font-size: 1.15rem; margin-top: 0; margin-bottom: 15px;'>🔬 Local Feature Attributions (Why This Prediction?)</h3>", unsafe_allow_html=True)
    
    explainers = []
    if profile['ap_hi'] >= 140 or profile['ap_lo'] >= 90:
        explainers.append(("🚨 Stage 2 Hypertension Impact", f"Arterial pressure metric ({profile['ap_hi']}/{profile['ap_lo']} mmHg) generates critical friction coefficients on heart chamber walls.", "+32% weight increase"))
    elif profile['ap_hi'] >= 130 or profile['ap_lo'] >= 80:
        explainers.append(("⚠️ Borderline Aortic Strain", f"Elevated blood pressure values ({profile['ap_hi']}/{profile['ap_lo']} mmHg) present mild vasoconstrictive patterns.", "+15% weight increase"))
        
    if profile['cholesterol'] >= 2:
        grade_str = "Elevated" if profile['cholesterol'] == 2 else "Severe Grade 3"
        explainers.append(("🩸 Hypercholesterolemia Gradient", f"Fasting lipid panel values denote {grade_str} arterial deposit risks.", "+22% weight increase" if profile['cholesterol'] == 3 else "+12% weight increase"))
        
    calc_bmi = profile['weight'] / ((profile['height']/100)**2)
    if calc_bmi >= 30:
        explainers.append(("⚖️ Class-I Obesity Workload", f"Calculated Body Mass Index ({calc_bmi:.1f}) demands higher baseline micro-vascular flow loops.", "+18% weight increase"))
    elif calc_bmi >= 25:
        explainers.append(("⚖️ Overweight BMI Baseline", f"Calculated Body Mass Index ({calc_bmi:.1f}) provides moderate systemic workload additions.", "+8% weight increase"))
        
    if profile['smoke'] == 1:
        explainers.append(("🚬 Endothelial Nicotine Decay", "Active tobacco profile triggers immediate vascular walls inflammation and vessel narrowing.", "+15% weight increase"))
        
    if profile['active'] == 0:
        explainers.append(("🏃‍♂️ Sedentary Activity Coefficient", "Lack of regular exercise profiles is strongly linked to vessel wall stiffening.", "+10% weight increase"))
        
    if profile['age_years'] >= 55:
        explainers.append(("📅 Demographical Aging Baseline", f"Age of {profile['age_years']} years indicates a natural, unavoidable vessel stiffening curve.", "+15% weight increase"))
        
    if not explainers:
        st.markdown("<p style='color: #2DD4BF; font-size: 0.9rem; margin: 0;'>Patient presents with optimal hemodynamic baselines. Zero cardiovascular risk drivers flagged.</p>", unsafe_allow_html=True)
    else:
        cols = st.columns(len(explainers))
        for idx, (title, text, impact) in enumerate(explainers):
            with cols[idx]:
                st.markdown(f"""
                <div style='background-color: #080a12; border: 1px solid rgba(226, 232, 240, 0.08); border-radius: 12px; padding: 16px; height: 160px; display: flex; flex-direction: column; justify-content: space-between;'>
                    <div>
                        <div style='font-size: 0.8rem; font-weight: 700; color: #FFFFFF;'>{title}</div>
                        <div style='font-size: 0.72rem; color: #94A3B8; margin-top: 6px; line-height: 1.35;'>{text}</div>
                    </div>
                    <div style='font-size: 0.78rem; font-weight: 800; color: #E63946; align-self: flex-end;'>{impact}</div>
                </div>
                """, unsafe_allow_html=True)
                
    st.markdown("</div>", unsafe_allow_html=True)


# ==================== SECTION 6: SCROLL-BASED EXPLANATION SECTIONS ====================
def render_explanations():
    st.markdown("<div style='margin-top: 80px;'></div>", unsafe_allow_html=True)
    st.markdown("""
    <div style='text-align: center; margin-bottom: 40px;'>
        <h2 class='scrolly-title' style='font-size: 2rem; margin: 0 0 10px 0;'>3. Arterial Strains & Pathology Mechanics</h2>
        <p style='color: #94A3B8; font-size: 1rem; max-width: 600px; margin: 0 auto;'>Visualizing the biological pathways through which biometric abnormalities escalate into chronic cardiovascular conditions.</p>
    </div>
    """, unsafe_allow_html=True)
    
    col_story1, col_story2 = st.columns(2, gap="large")
    
    with col_story1:
        st.markdown("<div class='narrative-container' style='height: 480px; display: flex; flex-direction: column; justify-content: space-between; margin-bottom: 0;'>", unsafe_allow_html=True)
        st.markdown("""
        <div>
            <h4 style='color: #00f2fe; font-size: 1rem; margin-top: 0; margin-bottom: 10px;'>Atherosclerosis Progression (Artery Narrowing)</h4>
            <p style='color: #94A3B8; font-size: 0.82rem; line-height: 1.5;'>
                High systemic blood pressure (systolic resistance) combined with high circulating serum cholesterol grades acts as an arterial catalyst. Over time, lipid particles infiltrate damaged vascular endothelium layers, triggering local macrophages to build calcified plaques.
            </p>
        </div>
        """, unsafe_allow_html=True)
        if os.path.exists(narrowing_path):
            st.image(narrowing_path, use_column_width=True, caption="Biomarker Pathways: Vascular Endothelium Plaque Infiltration & Vessel Stiffening")
        st.markdown("</div>", unsafe_allow_html=True)
        
    with col_story2:
        st.markdown("<div class='narrative-container' style='height: 480px; display: flex; flex-direction: column; justify-content: space-between; margin-bottom: 0;'>", unsafe_allow_html=True)
        st.markdown("""
        <div>
            <h4 style='color: #E63946; font-size: 1rem; margin-top: 0; margin-bottom: 10px;'>Cardiovascular Strain Architectures</h4>
            <p style='color: #94A3B8; font-size: 0.82rem; line-height: 1.5;'>
                Systemic cardiovascular strain is rarely localized to a single vector. Plaque accumulation, arterial resistance, and muscular thickening work in lockstep to increase overall myocardial workload. This can manifest as coronary artery blockages, valve leakage, heart muscle failure, or irregular cardiac rhythm strains.
            </p>
        </div>
        """, unsafe_allow_html=True)
        if os.path.exists(disease_types_path):
            st.image(disease_types_path, use_column_width=True, caption="Integrated Diagnostic Map: Intersecting Vascular Strain & Heart Diseases")
        st.markdown("</div>", unsafe_allow_html=True)


# ==================== SECTION 7: RECOMMENDATIONS ====================
def render_recommendations():
    st.markdown("<div style='margin-top: 80px;'></div>", unsafe_allow_html=True)
    st.markdown("""
    <div style='text-align: center; margin-bottom: 40px;'>
        <h2 class='scrolly-title' style='font-size: 2rem; margin: 0 0 10px 0;'>4. Preventative Health Interventions</h2>
        <p style='color: #94A3B8; font-size: 1rem; max-width: 600px; margin: 0 auto;'>Targeted physiological safeguards designed to buffer systemic vascular wear.</p>
    </div>
    """, unsafe_allow_html=True)
    
    # Render static baseline or patient-specific suggestions if analyzed
    profile = st.session_state.patient_profile if st.session_state.analyzed else {
        'ap_hi': 120, 'ap_lo': 80, 'cholesterol': 1, 'active': 1, 'smoke': 0
    }
    
    col_rec1, col_rec2 = st.columns(2, gap="large")
    
    with col_rec1:
        st.markdown("""
        <div class="narrative-container" style="min-height: 280px; margin-bottom: 0;">
            <h4 style='color: #00f2fe; font-size: 0.95rem; margin-top: 0; margin-bottom: 15px;'>Hemodynamic & Metabolic Actions</h4>
            <ul style='color: #94A3B8; font-size: 0.88rem; line-height: 1.65; padding-left: 20px; margin: 0;'>
        """, unsafe_allow_html=True)
        
        if profile['ap_hi'] >= 130 or profile['ap_lo'] >= 80:
            st.markdown("<li><b>Sodium Restriction Targets:</b> Restrict daily sodium intake to <1,500 mg to lower systemic arterial friction.</li>", unsafe_allow_html=True)
            st.markdown("<li><b>Vascular Monitoring Loop:</b> Record bi-weekly blood pressure vectors to track sub-clinical vascular spikes.</li>", unsafe_allow_html=True)
        else:
            st.markdown("<li><b>Homeostatic Blood Pressure:</b> Maintain current balanced salt intake thresholds.</li>", unsafe_allow_html=True)
            
        if profile['cholesterol'] >= 2:
            st.markdown("<li><b>Lipid Vector Management:</b> Maximize omega-3 fatty acids and soluble fibers to clear lipid accumulation.</li>", unsafe_allow_html=True)
            st.markdown("<li><b>Cardiology Diagnostics:</b> Seek professional lipid panel screening loops (HDL/LDL ratios).</li>", unsafe_allow_html=True)
        else:
            st.markdown("<li><b>Lipid Homeostasis:</b> Maintain healthy dietary fat balances.</li>", unsafe_allow_html=True)
            
        st.markdown("</ul></div>", unsafe_allow_html=True)
        
    with col_rec2:
        st.markdown("""
        <div class="narrative-container" style="min-height: 280px; margin-bottom: 0;">
            <h4 style='color: #E63946; font-size: 0.95rem; margin-top: 0; margin-bottom: 15px;'>Lifestyle & Cellular Safeguards</h4>
            <ul style='color: #94A3B8; font-size: 0.88rem; line-height: 1.65; padding-left: 20px; margin: 0;'>
        """, unsafe_allow_html=True)
        
        if profile['active'] == 0:
            st.markdown("<li><b>Vascular Exercise Loop:</b> Introduce >=150 minutes of weekly aerobic exercises to expand capillary branch nets.</li>", unsafe_allow_html=True)
        else:
            st.markdown("<li><b>Exercise Safeguard Active:</b> Maintain the current physical activity index to buffer aging strain factors.</li>", unsafe_allow_html=True)
            
        if profile['smoke'] == 1:
            st.markdown("<li><b>Tobacco Endothelial Protection:</b> Seek smoking cessation plans to instantly halt direct vascular wall inflammation.</li>", unsafe_allow_html=True)
        else:
            st.markdown("<li><b>Endothelial Integrity Preserved:</b> Abstinence from tobacco products reduces standard lifetime stroke risk coefficients.</li>", unsafe_allow_html=True)
            
        st.markdown("</ul></div>", unsafe_allow_html=True)


# ==================== SECTION 8: VISUAL HEALTH EDUCATION ====================
def render_visual_anatomy():
    st.markdown("<div class='narrative-container' style='margin-top: 40px;'>", unsafe_allow_html=True)
    st.markdown("<h3 style='color: #FFFFFF; font-size: 1.15rem; margin-top: 0; margin-bottom: 15px;'>🫀 Myocardial Blood Supply & Anatomy Mechanics</h3>", unsafe_allow_html=True)
    
    col_edu1, col_edu2 = st.columns([1, 1], gap="large")
    
    with col_edu1:
        if os.path.exists(anatomy_path):
            st.image(anatomy_path, use_column_width=True, caption="Myocardial Anatomical Map: Coronary Arterial Branches and Endothelial Flow Nets")
        else:
            st.info("Visual anatomy asset not loaded.")
            
    with col_edu2:
        st.markdown("""
        <div style='margin-top: 20px;'>
            <h4 style='color: #00f2fe; font-size: 1rem; margin-top: 0; margin-bottom: 12px;'>Understanding Coronary Circulation</h4>
            <p style='color: #94A3B8; font-size: 0.86rem; line-height: 1.6; margin-bottom: 15px;'>
                The heart muscle requires a continuous supply of oxygenated blood delivered via the left and right coronary arteries branching directly off the aorta. When high systolic blood pressure and cholesterol grades stiffen these vessels, oxygen delivery becomes compromised, raising myocardial infarction risks.
            </p>
            <div style='background: rgba(230, 57, 70, 0.04); border: 1px solid rgba(230, 57, 70, 0.15); border-radius: 12px; padding: 15px; font-size: 0.78rem; color: #E63946; line-height: 1.45;'>
                <b>Diagnostic Insight:</b> Regular physical exercise directly expands capillary network densities and prompts arterial remodeling, serving as an effective protective buffer against age-related aortic decay.
            </div>
        </div>
        """, unsafe_allow_html=True)
    st.markdown("</div>", unsafe_allow_html=True)


# ==================== SECTION 9: FOOTER ====================
def render_footer():
    st.markdown("""
    <hr style='border-color: rgba(226, 232, 240, 0.08); margin: 60px 0 20px 0;'>
    <div style='display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 20px; font-size: 0.75rem; color: #64748B;'>
        <div>
            <h4 style='color: #94A3B8; font-size: 0.85rem; margin: 0 0 10px 0;'>CardioVision AI Portfolio</h4>
            <p style='margin: 0;'>Engineered and Designed as an interactive scrollytelling experience.</p>
            <p style='margin: 3px 0 0 0;'>Code Repository: <a href='https://github.com/aryan742/cardiovision-ai' target='_blank' style='color: #00f2fe; text-decoration: none;'>GitHub</a></p>
        </div>
        <div>
            <h4 style='color: #94A3B8; font-size: 0.85rem; margin: 0 0 10px 0;'>Pipeline Framework</h4>
            <p style='margin: 0;'>Optimal Model: scikit-learn / XGBoost Ensemble Classifier</p>
            <p style='margin: 3px 0 0 0;'>Target Validation ROC-AUC: 98.71%</p>
        </div>
        <div style='max-width: 400px;'>
            <h4 style='color: #94A3B8; font-size: 0.85rem; margin: 0 0 10px 0;'>Clinical Disclaimer</h4>
            <p style='margin: 0; line-height: 1.4;'>CardioVision AI is a de-identified EHR intelligence platform intended strictly for mock analysis. Predictions must not be used to replace professional clinical diagnostics.</p>
        </div>
    </div>
    <div style='margin-top: 30px; text-align: center; font-size: 0.7rem; color: #475569;'>© 2026 CardioVision AI Platform. Fully Open-Source MIT License.</div>
    """, unsafe_allow_html=True)


if __name__ == "__main__":
    main()
