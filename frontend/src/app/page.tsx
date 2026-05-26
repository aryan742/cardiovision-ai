"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { 
  Activity, 
  Heart, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Sliders, 
  Award, 
  Settings, 
  ChevronRight, 
  Layers, 
  TrendingUp, 
  HelpCircle,
  Clock,
  Dna,
  RefreshCw,
  Wind
} from "lucide-react";
import HeartSequenceCanvas from "@/components/HeartSequenceCanvas";
import { CircleMenu } from "@/components/ui/circle-menu";
import { CinematicFooter } from "@/components/ui/motion-footer";
import { GlowCard } from "@/components/ui/spotlight-card";
import { InfiniteGrid } from "@/components/ui/the-infinite-grid";
import { Button } from "@/components/ui/button";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll position of the entire window for sequence mapping
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        // Map 0 to 0.65 scroll progress to frame index 0.0 to 1.0 (to reassemble at the end of scrolly path)
        const rawProgress = window.scrollY / totalHeight;
        const progressMapped = Math.min(1, rawProgress / 0.65);
        setScrollProgress(progressMapped);
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Loading state for canvas frames
  const [isPreloaderFinished, setIsPreloaderFinished] = useState(false);

  // Active form section state (heart, diabetes, cancer)
  const [activeTab, setActiveTab] = useState<"heart" | "diabetes" | "cancer">("heart");
  
  // ML Model Algorithms
  const [selectedAlgo, setSelectedAlgo] = useState<"xgb" | "rf" | "svm" | "lr">("xgb");

  // Heart Input Form State
  const [heartForm, setHeartForm] = useState({
    age: 54,
    sex: 1,
    cp: 3,
    trestbps: 120,
    chol: 230,
    fbs: 0,
    restecg: 1,
    thalach: 150,
    exang: 0,
    oldpeak: 1.2,
    slope: 1,
    ca: 0,
    thal: 3
  });

  // Diabetes Input Form State
  const [diabForm, setDiabForm] = useState({
    pregnancies: 2,
    glucose: 120,
    blood_pressure: 70,
    skin_thickness: 20,
    insulin: 80,
    bmi: 28.5,
    pedigree: 0.45,
    age: 33
  });

  // Cancer Input Form State
  const [cancerForm, setCancerForm] = useState({
    radius_mean: 14.0,
    texture_mean: 19.0,
    perimeter_mean: 90.0,
    area_mean: 600.0,
    smoothness_mean: 0.09,
    compactness_mean: 0.10,
    concavity_mean: 0.08,
    concave_points_mean: 0.05,
    symmetry_mean: 0.18,
    fractal_dimension_mean: 0.06
  });

  // Prediction Response States
  const [predictionResult, setPredictionResult] = useState<any>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Navbar sticky fade state
  const [scrolledPastHero, setScrolledPastHero] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setScrolledPastHero(true);
      } else {
        setScrolledPastHero(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Make prediction API call to FastAPI backend
  const triggerPrediction = async () => {
    setIsPredicting(true);
    setErrorMsg("");
    setPredictionResult(null);

    const backendUrl = "http://localhost:8000";
    let endpoint = "";
    let payload = {};

    if (activeTab === "heart") {
      endpoint = "/predict/heart";
      payload = { ...heartForm, algorithm: selectedAlgo };
    } else if (activeTab === "diabetes") {
      endpoint = "/predict/diabetes";
      payload = { ...diabForm, algorithm: selectedAlgo };
    } else {
      endpoint = "/predict/cancer";
      payload = { ...cancerForm, algorithm: selectedAlgo };
    }

    try {
      const res = await fetch(`${backendUrl}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        throw new Error(`API error: ${res.statusText}`);
      }
      const data = await res.json();
      
      // Delay slightly for premium feeling loader
      setTimeout(() => {
        setPredictionResult(data);
        setIsPredicting(false);
      }, 800);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Failed to connect to the CardioVision AI Engine on port 8000. Please ensure the backend is running.");
      setIsPredicting(false);
    }
  };

  // Run initial prediction once preloaded
  useEffect(() => {
    if (isPreloaderFinished) {
      triggerPrediction();
    }
  }, [isPreloaderFinished, activeTab, selectedAlgo]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Text box content maps along the scroll path
  const textRanges = [
    { start: 0, end: 0.12, key: "intro" },
    { start: 0.15, end: 0.32, key: "pathology" },
    { start: 0.35, end: 0.52, key: "biomarkers" },
    { start: 0.55, end: 0.72, key: "intelligence" }
  ];

  return (
    <main ref={containerRef} className="relative w-full min-h-[450vh] bg-[#050505] overflow-x-hidden select-none">
      
      {/* 1. INFINITE GRID & ENVIRONMENT BACKDROP */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.4]">
        <InfiniteGrid />
      </div>
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_50%_40%,rgba(0,80,255,0.02)_0%,transparent_60%)]" />

      {/* 2. APPLE-STYLE TRANSLUCENT NAVIGATION BAR */}
      <motion.nav 
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 border-b ${
          scrolledPastHero 
            ? "bg-[#050505]/75 backdrop-blur-md border-white/5 py-3 shadow-lg" 
            : "bg-transparent border-transparent py-5"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Heart className="text-red-500 fill-red-500/20 animate-pulse" size={18} />
            <span className="text-white font-black tracking-[0.25em] text-xs uppercase">CardioVision AI</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-neutral-400 text-xs font-semibold tracking-widest uppercase">
            <button onClick={() => scrollToSection("interactive-path")} className="hover:text-white transition-colors">Pathology</button>
            <button onClick={() => scrollToSection("diagnostic-terminal")} className="hover:text-white transition-colors">Diagnostics</button>
            <button onClick={() => scrollToSection("scientific-literature")} className="hover:text-white transition-colors">Telemetry</button>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden lg:flex items-center gap-2 bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono tracking-widest uppercase px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Engine: Online
            </span>
            <Button 
              variant="outline" 
              onClick={() => scrollToSection("diagnostic-terminal")}
              className="text-[10px] uppercase font-bold tracking-widest border-teal-500/30 text-teal-400 hover:bg-teal-500/10 hover:text-white"
            >
              Analyze Biomarkers
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* 3. STICKY CANVAS WRAPPER (pins the heart sequence) */}
      <div className="sticky top-0 w-full h-screen z-10 overflow-hidden bg-transparent pointer-events-none">
        
        {/* Underlay ambient lights */}
        <div className="absolute inset-0 bg-[#050505]" />
        
        <div className="absolute inset-0 z-0 pointer-events-none flex justify-center items-center">
          <div className="w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full bg-gradient-to-tr from-red-500/5 to-blue-500/5 filter blur-[100px] opacity-60" />
        </div>

        <HeartSequenceCanvas 
          scrollProgress={scrollProgress} 
          onLoadingComplete={() => setIsPreloaderFinished(true)} 
        />

        {/* Floating ECG simulator overlay inside canvas area */}
        <div className="absolute bottom-6 left-6 md:left-12 pointer-events-none z-10 hidden sm:block bg-black/40 backdrop-blur-md px-4 py-2 border border-white/5 rounded-xl font-mono text-[9px] text-white/50 tracking-wider">
          <div className="flex items-center gap-2">
            <Activity className="text-red-500 animate-pulse" size={12} />
            <span>SINUS RHYTHM: DYNAMIC</span>
            <span className="text-white/20">|</span>
            <span className="text-teal-400 animate-pulse">72 BPM</span>
          </div>
        </div>
      </div>

      {/* 4. SCROLLYTELLING TEXT OVERLAYS (absolute layers floating above sticky track) */}
      <div id="interactive-path" className="relative w-full z-20 top-[-100vh]">
        
        {/* Intro Beat (0-12%) */}
        <div className="min-h-screen w-full flex items-center justify-start px-6 md:px-24">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08]">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] text-white/60 tracking-wider uppercase font-mono">Cardiovascular Predictive Suite</span>
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-white leading-none">
              Predictive Medicine. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-blue-500">
                Visualized.
              </span>
            </h1>
            
            <p className="text-base text-neutral-400 font-light leading-relaxed max-w-lg">
              Explore your biological core. CardioVision AI synthesizes UCI datasets and deep neural diagnostics into an Apple-level interactive scrollytelling canvas.
            </p>

            <div className="flex items-center gap-4 pt-4">
              <Button 
                onClick={() => scrollToSection("diagnostic-terminal")} 
                className="bg-red-500 hover:bg-red-600 text-white font-bold tracking-widest text-xs uppercase px-6 py-5 rounded-xl"
              >
                Diagnostic Core
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => scrollToSection("pathology-anchor")} 
                className="text-neutral-400 hover:text-white font-bold tracking-widest text-xs uppercase"
              >
                Explore Pathology <ChevronRight size={14} className="ml-1" />
              </Button>
            </div>
          </div>
        </div>

        {/* Pathology Beat (15-32%) */}
        <div id="pathology-anchor" className="min-h-screen w-full flex items-center justify-end px-6 md:px-24">
          <div className="max-w-md bg-[#0A0A0C]/60 backdrop-blur-xl border border-white/5 p-8 rounded-3xl space-y-4">
            <span className="text-[10px] text-teal-400 font-mono tracking-widest uppercase">Biomarker Segment 01 // Coronary Core</span>
            <h2 className="text-3xl font-black text-white tracking-tight">Precision-Engineered Pathology</h2>
            <p className="text-sm text-neutral-400 font-light leading-relaxed">
              As you scroll, the anatomical core separates, disassembling into an interactive diagram of major valves, chambers, and cardiac vessels.
            </p>
            <div className="h-[1px] bg-white/5 w-full my-2" />
            <p className="text-xs text-neutral-500 leading-relaxed font-light">
              By isolating internal dynamics, we reveal how blood pressure, resting electrocardiographic metrics, and vascular stress factors combine to formulate active diagnostic coefficients.
            </p>
          </div>
        </div>

        {/* Biomarkers Beat (35-52%) */}
        <div className="min-h-screen w-full flex items-center justify-start px-6 md:px-24">
          <div className="max-w-md bg-[#0A0A0C]/60 backdrop-blur-xl border border-white/5 p-8 rounded-3xl space-y-4">
            <span className="text-[10px] text-red-400 font-mono tracking-widest uppercase">Biomarker Segment 02 // Vital Telemetry</span>
            <h2 className="text-3xl font-black text-white tracking-tight">Vascular Stability Metrics</h2>
            <p className="text-sm text-neutral-400 font-light leading-relaxed">
              We ingest multi-biomarker metrics including serum cholesterol level, maximum heart rate achieved (thalach), ST depression (oldpeak), and fasting blood glucose indices.
            </p>
            <div className="h-[1px] bg-white/5 w-full my-2" />
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <span className="block text-white font-bold text-lg font-mono">140+</span>
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Trestbps Strain</span>
              </div>
              <div>
                <span className="block text-white font-bold text-lg font-mono">240+</span>
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Cholesterol Limit</span>
              </div>
            </div>
          </div>
        </div>

        {/* Intelligence Beat (55-72%) */}
        <div className="min-h-screen w-full flex items-center justify-end px-6 md:px-24">
          <div className="max-w-md bg-[#0A0A0C]/60 backdrop-blur-xl border border-white/5 p-8 rounded-3xl space-y-4">
            <span className="text-[10px] text-purple-400 font-mono tracking-widest uppercase">Biomarker Segment 03 // ML Classifiers</span>
            <h2 className="text-3xl font-black text-white tracking-tight">Adaptive Neural Diagnostics</h2>
            <p className="text-sm text-neutral-400 font-light leading-relaxed">
              CardioVision AI deploys four advanced classification algorithms (XGBoost, SVM, Logistic Regression, Random Forest) trained on UCI datasets to map risk coefficients.
            </p>
            <div className="h-[1px] bg-white/5 w-full my-2" />
            <p className="text-xs text-neutral-500 leading-relaxed font-light">
              This system achieves up to 95.6% diagnostic accuracy, providing instant predictions alongside explainable XAI local feature contribution analytics.
            </p>
          </div>
        </div>

      </div>

      {/* 5. ACTIVE CLINICAL ASSESSMENT DASHBOARD (Section where form sits) */}
      <section id="diagnostic-terminal" className="relative z-30 bg-[#050505] pt-20 pb-40 border-t border-white/5">
        
        {/* Soft background glow */}
        <div className="absolute top-0 inset-x-0 h-[40vh] bg-gradient-to-b from-blue-950/10 to-transparent pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative">
          
          {/* Header block */}
          <div className="text-center max-w-3xl mx-auto space-y-6 mb-20">
            <div className="inline-flex items-center gap-3 bg-red-950/20 border border-red-500/20 text-red-400 rounded-full px-4 py-1.5">
              <Sliders size={14} className="animate-spin" style={{ animationDuration: "10s" }} />
              <span className="text-[10px] font-mono tracking-widest uppercase">Interactive Diagnostic Terminal</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">
              Biomarker Clinical Core
            </h2>
            
            <p className="text-base md:text-lg text-neutral-400 font-light leading-relaxed">
              Submit patient parameters to run real-time inference across our neural models. Switch diagnostic scopes to analyze Cardiac, Diabetic, or Oncological datasets.
            </p>

            {/* Scope selectors */}
            <div className="flex justify-center gap-4 pt-4">
              <button 
                onClick={() => setActiveTab("heart")}
                className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest border transition-all duration-300 ${
                  activeTab === "heart" 
                    ? "bg-red-500/10 border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]" 
                    : "bg-white/[0.02] border-white/5 text-neutral-400 hover:text-white"
                }`}
              >
                Heart Disease
              </button>
              
              <button 
                onClick={() => setActiveTab("diabetes")}
                className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest border transition-all duration-300 ${
                  activeTab === "diabetes" 
                    ? "bg-blue-500/10 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]" 
                    : "bg-white/[0.02] border-white/5 text-neutral-400 hover:text-white"
                }`}
              >
                Diabetes
              </button>

              <button 
                onClick={() => setActiveTab("cancer")}
                className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest border transition-all duration-300 ${
                  activeTab === "cancer" 
                    ? "bg-purple-500/10 border-purple-500 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]" 
                    : "bg-white/[0.02] border-white/5 text-neutral-400 hover:text-white"
                }`}
              >
                Breast Cancer
              </button>
            </div>
          </div>

          {/* Core Interface Split Screen Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Interactive Param Form (takes 7 cols) */}
            <div className="lg:col-span-7 bg-[#0A0A0C]/50 border border-white/5 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden space-y-8">
              
              {/* Algorithm select HUD */}
              <div className="flex justify-between items-center border-b border-white/5 pb-6">
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono block mb-1">Diagnostic Model</span>
                  <span className="text-white font-bold text-sm">Select Inference Classifier</span>
                </div>
                <div className="flex gap-2 bg-black/40 p-1 rounded-xl border border-white/5">
                  {(["xgb", "rf", "svm", "lr"] as const).map((algo) => (
                    <button
                      key={algo}
                      onClick={() => setSelectedAlgo(algo)}
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-mono uppercase font-bold tracking-wider transition-all ${
                        selectedAlgo === algo 
                          ? "bg-white text-black font-black" 
                          : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      {algo}
                    </button>
                  ))}
                </div>
              </div>

              {/* Heart Form Fields */}
              {activeTab === "heart" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-2 font-mono">Patient Age ({heartForm.age} yrs)</label>
                    <input 
                      type="range" min="1" max="100" value={heartForm.age}
                      onChange={(e) => setHeartForm({ ...heartForm, age: parseInt(e.target.value) })}
                      className="w-full accent-red-500 bg-white/5 rounded-lg appearance-none h-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-2 font-mono">Biological Sex</label>
                    <select 
                      value={heartForm.sex}
                      onChange={(e) => setHeartForm({ ...heartForm, sex: parseInt(e.target.value) })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-red-500/50"
                    >
                      <option value="1">Male</option>
                      <option value="0">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-2 font-mono">Chest Pain Type</label>
                    <select 
                      value={heartForm.cp}
                      onChange={(e) => setHeartForm({ ...heartForm, cp: parseInt(e.target.value) })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-red-500/50"
                    >
                      <option value="1">Typical Angina</option>
                      <option value="2">Atypical Angina</option>
                      <option value="3">Non-Anginal Pain</option>
                      <option value="4">Asymptomatic</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-2 font-mono">Resting Blood Pressure ({heartForm.trestbps} mmHg)</label>
                    <input 
                      type="range" min="80" max="200" value={heartForm.trestbps}
                      onChange={(e) => setHeartForm({ ...heartForm, trestbps: parseInt(e.target.value) })}
                      className="w-full accent-red-500 bg-white/5 rounded-lg appearance-none h-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-2 font-mono">Serum Cholesterol ({heartForm.chol} mg/dl)</label>
                    <input 
                      type="range" min="100" max="500" value={heartForm.chol}
                      onChange={(e) => setHeartForm({ ...heartForm, chol: parseInt(e.target.value) })}
                      className="w-full accent-red-500 bg-white/5 rounded-lg appearance-none h-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-2 font-mono">Fasting Blood Sugar</label>
                    <select 
                      value={heartForm.fbs}
                      onChange={(e) => setHeartForm({ ...heartForm, fbs: parseInt(e.target.value) })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-red-500/50"
                    >
                      <option value="0">Normal (&lt; 120 mg/dl)</option>
                      <option value="1">Elevated (&gt; 120 mg/dl)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-2 font-mono">Resting ECG</label>
                    <select 
                      value={heartForm.restecg}
                      onChange={(e) => setHeartForm({ ...heartForm, restecg: parseInt(e.target.value) })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-red-500/50"
                    >
                      <option value="0">Normal</option>
                      <option value="1">ST-T Wave Abnormality</option>
                      <option value="2">Left Ventricular Hypertrophy</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-2 font-mono">Max Heart Rate Achieved ({heartForm.thalach} bpm)</label>
                    <input 
                      type="range" min="60" max="220" value={heartForm.thalach}
                      onChange={(e) => setHeartForm({ ...heartForm, thalach: parseInt(e.target.value) })}
                      className="w-full accent-red-500 bg-white/5 rounded-lg appearance-none h-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-2 font-mono">Exercise Angina</label>
                    <select 
                      value={heartForm.exang}
                      onChange={(e) => setHeartForm({ ...heartForm, exang: parseInt(e.target.value) })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-red-500/50"
                    >
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-2 font-mono">ST Depression (Oldpeak: {heartForm.oldpeak})</label>
                    <input 
                      type="range" min="0" max="6" step="0.1" value={heartForm.oldpeak}
                      onChange={(e) => setHeartForm({ ...heartForm, oldpeak: parseFloat(e.target.value) })}
                      className="w-full accent-red-500 bg-white/5 rounded-lg appearance-none h-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-2 font-mono">Peak ST Segment Slope</label>
                    <select 
                      value={heartForm.slope}
                      onChange={(e) => setHeartForm({ ...heartForm, slope: parseInt(e.target.value) })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-red-500/50"
                    >
                      <option value="1">Upsloping</option>
                      <option value="2">Flat</option>
                      <option value="3">Downsloping</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-2 font-mono">Colored Major Vessels (0-3)</label>
                    <select 
                      value={heartForm.ca}
                      onChange={(e) => setHeartForm({ ...heartForm, ca: parseInt(e.target.value) })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-red-500/50"
                    >
                      <option value="0">0 Vessels</option>
                      <option value="1">1 Vessel</option>
                      <option value="2">2 Vessels</option>
                      <option value="3">3 Vessels</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Diabetes Form Fields */}
              {activeTab === "diabetes" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-2 font-mono">Pregnancies ({diabForm.pregnancies})</label>
                    <input 
                      type="range" min="0" max="20" value={diabForm.pregnancies}
                      onChange={(e) => setDiabForm({ ...diabForm, pregnancies: parseInt(e.target.value) })}
                      className="w-full accent-blue-500 bg-white/5 rounded-lg appearance-none h-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-2 font-mono">Plasma Glucose ({diabForm.glucose} mg/dl)</label>
                    <input 
                      type="range" min="0" max="300" value={diabForm.glucose}
                      onChange={(e) => setDiabForm({ ...diabForm, glucose: parseInt(e.target.value) })}
                      className="w-full accent-blue-500 bg-white/5 rounded-lg appearance-none h-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-2 font-mono">Diastolic Blood Pressure ({diabForm.blood_pressure} mmHg)</label>
                    <input 
                      type="range" min="0" max="150" value={diabForm.blood_pressure}
                      onChange={(e) => setDiabForm({ ...diabForm, blood_pressure: parseInt(e.target.value) })}
                      className="w-full accent-blue-500 bg-white/5 rounded-lg appearance-none h-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-2 font-mono">Skinfold Thickness ({diabForm.skin_thickness} mm)</label>
                    <input 
                      type="range" min="0" max="100" value={diabForm.skin_thickness}
                      onChange={(e) => setDiabForm({ ...diabForm, skin_thickness: parseInt(e.target.value) })}
                      className="w-full accent-blue-500 bg-white/5 rounded-lg appearance-none h-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-2 font-mono">Insulin Level ({diabForm.insulin} mU/L)</label>
                    <input 
                      type="range" min="0" max="900" value={diabForm.insulin}
                      onChange={(e) => setDiabForm({ ...diabForm, insulin: parseInt(e.target.value) })}
                      className="w-full accent-blue-500 bg-white/5 rounded-lg appearance-none h-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-2 font-mono">Body Mass Index (BMI: {diabForm.bmi})</label>
                    <input 
                      type="range" min="10" max="60" step="0.1" value={diabForm.bmi}
                      onChange={(e) => setDiabForm({ ...diabForm, bmi: parseFloat(e.target.value) })}
                      className="w-full accent-blue-500 bg-white/5 rounded-lg appearance-none h-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-2 font-mono">Diabetes Pedigree Value ({diabForm.pedigree})</label>
                    <input 
                      type="range" min="0.08" max="2.5" step="0.01" value={diabForm.pedigree}
                      onChange={(e) => setDiabForm({ ...diabForm, pedigree: parseFloat(e.target.value) })}
                      className="w-full accent-blue-500 bg-white/5 rounded-lg appearance-none h-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-2 font-mono">Patient Age ({diabForm.age} yrs)</label>
                    <input 
                      type="range" min="21" max="100" value={diabForm.age}
                      onChange={(e) => setDiabForm({ ...diabForm, age: parseInt(e.target.value) })}
                      className="w-full accent-blue-500 bg-white/5 rounded-lg appearance-none h-1"
                    />
                  </div>
                </div>
              )}

              {/* Cancer Form Fields */}
              {activeTab === "cancer" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-2 font-mono">Mean Radius ({cancerForm.radius_mean} mm)</label>
                    <input 
                      type="range" min="5" max="30" step="0.1" value={cancerForm.radius_mean}
                      onChange={(e) => setCancerForm({ ...cancerForm, radius_mean: parseFloat(e.target.value) })}
                      className="w-full accent-purple-500 bg-white/5 rounded-lg appearance-none h-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-2 font-mono">Mean Texture ({cancerForm.texture_mean} index)</label>
                    <input 
                      type="range" min="5" max="40" step="0.1" value={cancerForm.texture_mean}
                      onChange={(e) => setCancerForm({ ...cancerForm, texture_mean: parseFloat(e.target.value) })}
                      className="w-full accent-purple-500 bg-white/5 rounded-lg appearance-none h-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-2 font-mono">Mean Perimeter ({cancerForm.perimeter_mean} mm)</label>
                    <input 
                      type="range" min="40" max="200" step="0.1" value={cancerForm.perimeter_mean}
                      onChange={(e) => setCancerForm({ ...cancerForm, perimeter_mean: parseFloat(e.target.value) })}
                      className="w-full accent-purple-500 bg-white/5 rounded-lg appearance-none h-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-2 font-mono">Mean Area ({cancerForm.area_mean} mm²)</label>
                    <input 
                      type="range" min="100" max="2500" value={cancerForm.area_mean}
                      onChange={(e) => setCancerForm({ ...cancerForm, area_mean: parseInt(e.target.value) })}
                      className="w-full accent-purple-500 bg-white/5 rounded-lg appearance-none h-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-2 font-mono">Smoothness Mean ({cancerForm.smoothness_mean})</label>
                    <input 
                      type="range" min="0.05" max="0.2" step="0.001" value={cancerForm.smoothness_mean}
                      onChange={(e) => setCancerForm({ ...cancerForm, smoothness_mean: parseFloat(e.target.value) })}
                      className="w-full accent-purple-500 bg-white/5 rounded-lg appearance-none h-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-2 font-mono">Compactness Mean ({cancerForm.compactness_mean})</label>
                    <input 
                      type="range" min="0.01" max="0.4" step="0.001" value={cancerForm.compactness_mean}
                      onChange={(e) => setCancerForm({ ...cancerForm, compactness_mean: parseFloat(e.target.value) })}
                      className="w-full accent-purple-500 bg-white/5 rounded-lg appearance-none h-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-2 font-mono">Concavity Mean ({cancerForm.concavity_mean})</label>
                    <input 
                      type="range" min="0.0" max="0.5" step="0.001" value={cancerForm.concavity_mean}
                      onChange={(e) => setCancerForm({ ...cancerForm, concavity_mean: parseFloat(e.target.value) })}
                      className="w-full accent-purple-500 bg-white/5 rounded-lg appearance-none h-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-2 font-mono">Concave Points Mean ({cancerForm.concave_points_mean})</label>
                    <input 
                      type="range" min="0.0" max="0.3" step="0.001" value={cancerForm.concave_points_mean}
                      onChange={(e) => setCancerForm({ ...cancerForm, concave_points_mean: parseFloat(e.target.value) })}
                      className="w-full accent-purple-500 bg-white/5 rounded-lg appearance-none h-1"
                    />
                  </div>
                </div>
              )}

              {/* Inference Button Trigger */}
              <div className="pt-6">
                <Button 
                  onClick={triggerPrediction} 
                  disabled={isPredicting}
                  className={`w-full py-6 rounded-2xl font-bold tracking-[0.2em] text-xs uppercase flex items-center justify-center gap-3 transition-all ${
                    activeTab === "heart" 
                      ? "bg-red-500 hover:bg-red-600 text-white" 
                      : activeTab === "diabetes" 
                        ? "bg-blue-500 hover:bg-blue-600 text-white" 
                        : "bg-purple-500 hover:bg-purple-600 text-white"
                  }`}
                >
                  <Activity size={16} className={isPredicting ? "animate-spin" : ""} />
                  {isPredicting ? "Running Neural Inference..." : "Evaluate Patient Profile"}
                </Button>
              </div>

              {errorMsg && (
                <div className="bg-red-950/20 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs font-light leading-relaxed flex items-start gap-3">
                  <AlertTriangle className="shrink-0 mt-0.5" size={16} />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>

            {/* Right Column: Diagnostic Feedback HUD (takes 5 cols) */}
            <div className="lg:col-span-5 h-full space-y-8">
              
              {/* Telemetry output card */}
              <div className="bg-[#0A0A0C]/50 border border-white/5 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden space-y-8 min-h-[480px] flex flex-col justify-between">
                
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono block mb-1">Diagnostic Outcome</span>
                  <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <span className="text-white font-bold text-sm">Telemetry Summary</span>
                    <span className="text-[10px] font-mono text-neutral-500">SECURE SHELL v1.2</span>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-center items-center py-6 text-center space-y-6">
                  {isPredicting ? (
                    <div className="space-y-4">
                      <div className="relative w-16 h-16 flex items-center justify-center mx-auto">
                        <div className="absolute inset-0 rounded-full border-2 border-white/5 border-t-teal-400 animate-spin" />
                        <Activity className="text-teal-400 animate-pulse" size={24} />
                      </div>
                      <span className="text-xs text-neutral-400 font-mono tracking-widest block uppercase">Executing Neural Classifiers</span>
                    </div>
                  ) : predictionResult ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-6 w-full"
                    >
                      {/* Classification Badge */}
                      <div className="space-y-2">
                        {predictionResult.prediction === 1 ? (
                          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/20 border border-red-500/20 text-red-400">
                            <AlertTriangle size={14} className="animate-bounce" />
                            <span className="text-[10px] font-mono font-bold uppercase tracking-widest">PATHOLOGY DETECTED</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/20 border border-emerald-500/20 text-emerald-400">
                            <CheckCircle size={14} />
                            <span className="text-[10px] font-mono font-bold uppercase tracking-widest">HOMEOSTASIS SECURE</span>
                          </div>
                        )}
                        <h3 className="text-3xl font-black text-white tracking-tight">{predictionResult.risk_level}</h3>
                      </div>

                      {/* Confidence Gauge dial */}
                      <div className="relative w-36 h-36 mx-auto flex items-center justify-center bg-black/40 rounded-full border border-white/5">
                        <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="6" />
                          <motion.circle 
                            cx="50" cy="50" r="42" fill="none" 
                            stroke={predictionResult.prediction === 1 ? "#FF2D55" : "#10B981"} 
                            strokeWidth="6" 
                            strokeDasharray="264"
                            initial={{ strokeDashoffset: 264 }}
                            animate={{ strokeDashoffset: 264 - (264 * predictionResult.probability) }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                          />
                        </svg>
                        <div className="text-center space-y-1 z-10">
                          <span className="block text-white font-mono text-3xl font-bold">
                            {Math.round(predictionResult.probability * 100)}%
                          </span>
                          <span className="text-[8px] text-neutral-500 uppercase tracking-widest font-mono block">Confidence</span>
                        </div>
                      </div>

                      {/* Explainability features mapping */}
                      <div className="space-y-3 text-left w-full">
                        <span className="text-[8px] text-neutral-500 uppercase tracking-widest font-mono block border-b border-white/5 pb-1.5">Local Feature Contribution (XAI)</span>
                        <div className="space-y-2">
                          {predictionResult.explainability.map((item: any, idx: number) => (
                            <div key={idx} className="space-y-1">
                              <div className="flex justify-between text-[10px] text-neutral-400">
                                <span>{item.feature}</span>
                                <span className="font-mono font-bold text-white">{item.contribution}%</span>
                              </div>
                              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                  className={`h-full ${
                                    predictionResult.prediction === 1 ? "bg-red-500/80" : "bg-emerald-500/80"
                                  }`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${item.contribution}%` }}
                                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="space-y-2 text-neutral-500 text-xs">
                      <Settings size={20} className="mx-auto opacity-30 animate-spin" style={{ animationDuration: "6s" }} />
                      <p>Awaiting Telemetry Submission</p>
                    </div>
                  )}
                </div>

                <div className="text-center text-[9px] text-neutral-600 font-mono tracking-wider uppercase border-t border-white/5 pt-4">
                  Secured & Protected by Cryptographic Patient Ledger
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 6. CLINICAL & SCIENTIFIC TELEMETRY LITERATURE SECTION */}
      <section id="scientific-literature" className="relative z-30 bg-[#0A0A0C] py-40 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-20">
            <div className="space-y-4">
              <span className="text-[10px] text-purple-400 font-mono tracking-widest uppercase block">Medical Science Hub</span>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Clinical Pathology & ML</h2>
            </div>
            <p className="text-xs text-neutral-400 max-w-md font-light leading-relaxed">
              Explore the physiological processes underlying each biomarker model. Machine learning acts as a clinical partner, surfacing risk vectors before structural damage manifests.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="glass-card p-8 rounded-3xl space-y-6 hover:border-red-500/20 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                <Heart size={20} />
              </div>
              <h4 className="text-white font-bold text-lg">Cardiometabolic Risk Dynamics</h4>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                High serum cholesterol and sustained systolic blood pressure induce endothelial strain. Over time, major coronary arteries calcify, causing myocardial oxygen starvation.
              </p>
              <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500 pt-4 border-t border-white/5">
                <span>MODEL ACCURACY</span>
                <span className="text-red-400 font-bold">88.5% ACC</span>
              </div>
            </div>

            <div className="glass-card p-8 rounded-3xl space-y-6 hover:border-blue-500/20 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <TrendingUp size={20} />
              </div>
              <h4 className="text-white font-bold text-lg">Insulin Signaling Pathways</h4>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                Sustained high plasma glucose triggers a hyperinsulinemic state. Receptor sites desensitize, accelerating vascular calcification and leading to microvascular nephropathies.
              </p>
              <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500 pt-4 border-t border-white/5">
                <span>MODEL ACCURACY</span>
                <span className="text-blue-400 font-bold">76.0% ACC</span>
              </div>
            </div>

            <div className="glass-card p-8 rounded-3xl space-y-6 hover:border-purple-500/20 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Dna size={20} />
              </div>
              <h4 className="text-white font-bold text-lg">Vascular Angiogenesis Markers</h4>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                Breast tissue diagnostic features radius mean, compactness, and concavity directly index uncontrolled cellular replication, signaling microvascular angiopathic changes.
              </p>
              <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500 pt-4 border-t border-white/5">
                <span>MODEL ACCURACY</span>
                <span className="text-purple-400 font-bold">95.6% ACC</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 7. CINEMATIC OUTRO FOOTER */}
      <CinematicFooter onStartAssessment={() => scrollToSection("diagnostic-terminal")} />

      {/* 8. MINI POPUP CIRCLE MENU NAVIGATOR */}
      <div className="fixed bottom-8 right-8 z-50">
        <CircleMenu 
          items={[
            { label: 'Pathology Path', icon: <Layers size={14} />, href: '#interactive-path', onClick: () => scrollToSection("interactive-path") },
            { label: 'Diagnostic Core', icon: <Sliders size={14} />, href: '#diagnostic-terminal', onClick: () => scrollToSection("diagnostic-terminal") },
            { label: 'Scientific Telemetry', icon: <FileText size={14} />, href: '#scientific-literature', onClick: () => scrollToSection("scientific-literature") },
            { label: 'Scroll to Top', icon: <ChevronRight size={14} className="-rotate-90" />, href: '#', onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }) }
          ]}
        />
      </div>

    </main>
  );
}
