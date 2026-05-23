"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import axios from "axios";
import HeartSequenceCanvas from "@/components/HeartSequenceCanvas";
import AppleNavbar from "@/components/AppleNavbar";
import { 
  Activity, HeartPulse, Dna, FileWarning, ShieldCheck, 
  CheckCircle2, ChevronRight, BarChart2, Zap, 
  Wind, TrendingUp, Users, RefreshCw
} from "lucide-react";
import Image from "next/image";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Deep, premium 520vh scroll track to give heart asset maximum screen time and pacing continuity
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Track absolute scroll progress
  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      setScrollProgress(latest);
    });
  }, [scrollYProgress]);

  // SMOOTH TRANSITIONS & FADES (0.0 to 1.0 of the 520vh sticky track)
  
  // 1. Hero text fade: slowly fades out as scroll starts
  const heroOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.18], [0, -35]);

  // 2. Anatomy reveal: slowly transitions in, remains visible, and slowly fades out
  const revealOpacity = useTransform(scrollYProgress, [0.18, 0.25, 0.42, 0.48], [0, 1, 1, 0]);
  const revealX = useTransform(scrollYProgress, [0.18, 0.25, 0.42, 0.48], [-25, 0, 0, -25]);

  // 3. Circulation flow: slowly fades in right after, overlaps, and fades out
  const circOpacity = useTransform(scrollYProgress, [0.44, 0.52, 0.68, 0.74], [0, 1, 1, 0]);
  const circX = useTransform(scrollYProgress, [0.44, 0.52, 0.68, 0.74], [25, 0, 0, 25]);

  // 4. Micro Complexity: floats in, stays, and dissolves as the dashboard arrives
  const detailOpacity = useTransform(scrollYProgress, [0.70, 0.76, 0.85, 0.88], [0, 1, 1, 0]);
  const detailY = useTransform(scrollYProgress, [0.70, 0.76, 0.85, 0.88], [25, 0, 0, -25]);

  // 5. Embedded Dashboard Fade-in (0.85 to 1.0)
  // Dashboard is overlaid DIRECTLY on top of the reassembled sticky heart canvas!
  const dashboardOpacity = useTransform(scrollYProgress, [0.85, 0.90], [0, 1]);
  const dashboardY = useTransform(scrollYProgress, [0.85, 0.90], [40, 0]);
  
  // Heart Canvas drift & scale down inside the dashboard layout (so the heart remains visible!)
  const heartScale = useTransform(scrollYProgress, [0.84, 0.90], [1, 0.7]);
  const heartX = useTransform(scrollYProgress, [0.84, 0.90], [0, 250]); // drifts to the right to leave space for form

  // Interactive Clinical Model States
  const [formData, setFormData] = useState({
    age: 58, gender: 1, height: 170, weight: 85, ap_hi: 145,
    ap_lo: 92, cholesterol: 3, gluc: 1, smoke: 1, alco: 0, active: 1
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [result, setResult] = useState<any>(null);

  const loadingMessages = [
    "Establishing neural biometric link...",
    "Querying clinical prediction weights...",
    "Analyzing lipid profile and glycemic indices...",
    "Correlating hemodynamic strain benchmarks...",
    "Generating absolute risk trajectory..."
  ];

  const handlePredict = async () => {
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    setAnalysisStep(0);

    const interval = setInterval(() => {
      setAnalysisStep((prev) => Math.min(prev + 1, loadingMessages.length - 1));
    }, 700);

    try {
      await new Promise((resolve) => setTimeout(resolve, 3200));

      const payload = { ...formData, age: formData.age * 365.25 };
      const response = await axios.post("http://localhost:8000/api/predict", payload);
      
      setResult(response.data);
      setAnalysisComplete(true);

      setTimeout(() => {
        const resultsEl = document.getElementById("clinical-results");
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);

    } catch (error) {
      console.error("Clinical model prediction failed:", error);
    } finally {
      clearInterval(interval);
      setIsAnalyzing(false);
    }
  };

  const isHighRisk = result?.risk_level === "High Risk";
  const confidence = result ? (result.confidence > 99 ? 99.1 : result.confidence).toFixed(1) : 0;
  const riskProb = result ? result.risk_probability.toFixed(1) : 0;

  return (
    <main className="relative bg-[#050505] text-white selection:bg-[#FF2D55]/30 overflow-x-hidden font-sans">
      <AppleNavbar />

      {/* 1. HERO & HEART SEQUENCE SECTION (First 520vh sticky track) */}
      <div ref={containerRef} className="relative h-[520vh] w-full">
        
        {/* Full-Screen Sticky Viewport */}
        <div className="sticky top-0 left-0 w-full h-screen overflow-hidden z-10 flex items-center justify-center bg-[#050505]">
          
          {/* Ambient Red Glow Layer */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,0,0,0.15)_0%,rgba(5,5,5,0)_70%)] pointer-events-none z-10" />

          {/* Sequence canvas component wrapped in drifts/scales for seamless dashboard anchoring */}
          <motion.div 
            style={{ scale: heartScale, x: heartX }} 
            className="absolute inset-0 w-full h-full"
          >
            <HeartSequenceCanvas 
              scrollProgress={scrollProgress} 
              onLoadingComplete={() => setIsLoaded(true)} 
            />
          </motion.div>

          {/* SCROLL-LINKED STORYTELLING OVERLAYS */}
          
          {/* Beat 1: HERO / INTRO */}
          <motion.div 
            style={{ opacity: heroOpacity, y: heroY }}
            className="absolute z-20 text-center max-w-2xl px-6 pointer-events-none"
          >
            <span className="text-[11px] text-teal-400 font-mono tracking-[0.3em] uppercase block mb-4">
              Biomedical Telemetry Core
            </span>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white mb-6">
              Human Heart
            </h1>
            <p className="text-xl md:text-2xl text-[#FF2D55] font-light tracking-wide mb-3">
              The engine of life.
            </p>
            <p className="text-sm text-white/50 tracking-widest uppercase max-w-md mx-auto">
              Precision, rhythm, and biology in perfect synchronization.
            </p>
          </motion.div>

          {/* Beat 2: ANATOMICAL REVEAL */}
          <motion.div 
            style={{ opacity: revealOpacity, x: revealX }}
            className="absolute z-20 left-12 md:left-24 max-w-md px-6 text-left pointer-events-none"
          >
            <span className="text-[10px] text-teal-400 font-mono tracking-widest uppercase block mb-3">
              01 // Disassembly Phase
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
              Engineered by evolution.
            </h2>
            <div className="space-y-4 text-white/60 text-sm leading-relaxed font-light border-l border-[#FF2D55]/30 pl-4">
              <p>Four chambers working in perfect coordination.</p>
              <p>Every muscle fiber optimized for continuous biological motion.</p>
              <p>A biological system refined over millions of years.</p>
            </div>
          </motion.div>

          {/* Beat 3: CIRCULATION & STRUCTURE */}
          <motion.div 
            style={{ opacity: circOpacity, x: circX }}
            className="absolute z-20 right-12 md:right-24 max-w-md px-6 text-right pointer-events-none"
          >
            <span className="text-[10px] text-teal-400 font-mono tracking-widest uppercase block mb-3">
              02 // Vascular Flow
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
              Built for constant flow.
            </h2>
            <div className="space-y-4 text-white/60 text-sm leading-relaxed font-light border-r border-[#FF2D55]/30 pr-4">
              <p>Over 100,000 systolic actions executed every day.</p>
              <p>Delivers precious oxygen through an intricate vascular network.</p>
              <p>Highly adaptive, resilient, and endlessly precise.</p>
            </div>
          </motion.div>

          {/* Beat 4: MICRO DETAIL & BIOLOGICAL COMPLEXITY */}
          <motion.div 
            style={{ opacity: detailOpacity, y: detailY }}
            className="absolute z-20 max-w-2xl px-6 text-center pointer-events-none"
          >
            <span className="text-[10px] text-teal-400 font-mono tracking-widest uppercase block mb-3">
              03 // Volumetric Mapping
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
              Complexity in every detail.
            </h2>
            <p className="text-white/60 text-base leading-relaxed font-light max-w-lg mx-auto">
              Layered biological architecture engineered for absolute endurance. 
              Every micro-membrane and valve contributes to systolic rhythm, vital pressure, and life itself.
            </p>
          </motion.div>

          {/* 2. REASSEMBLY & EMBEDDED CLINICAL DASHBOARD (Fades in over sticky heart canvas) */}
          <motion.div
            style={{ opacity: dashboardOpacity, y: dashboardY }}
            className="absolute inset-0 z-30 pointer-events-auto flex items-center justify-center p-6 md:p-12 overflow-y-auto hide-scrollbar"
          >
            <div className="max-w-[1300px] w-full mx-auto relative pt-16">
              
              {/* Soft red glow behind inputs */}
              <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#8B0000]/10 rounded-full blur-[80px] pointer-events-none -z-10" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                
                {/* Input Matrix Config Card */}
                <div className="lg:col-span-8 glass-card bg-[#0A0A0C]/75 border-white/5 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-8">
                      <div className="flex items-center gap-3">
                        <span className="text-[#FF2D55] font-bold font-mono text-sm">[04]</span>
                        <h3 className="text-white font-bold uppercase tracking-widest text-xs">Biometric Matrix Configuration</h3>
                      </div>
                      <span className="text-[10px] text-teal-400 font-mono">DYNAMIC TELEMETRY LINK // ACTIVE</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      
                      {/* Demographics */}
                      <div className="space-y-4">
                        <h4 className="text-[10px] text-teal-400 font-mono tracking-widest uppercase border-b border-white/5 pb-2">Bioprofile Vector</h4>
                        
                        <div>
                          <div className="flex justify-between mb-2">
                            <label className="text-[10px] text-white/50 uppercase tracking-widest font-mono">Patient Age</label>
                            <span className="text-[10px] text-teal-400 font-mono font-bold">{formData.age} years</span>
                          </div>
                          <input type="range" min="18" max="100" value={formData.age} onChange={e => setFormData({...formData, age: +e.target.value})} className="w-full accent-[#FF2D55] h-1 rounded-lg appearance-none bg-white/5 cursor-pointer" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] text-white/50 uppercase tracking-widest font-mono mb-2">Sex</label>
                            <select value={formData.gender} onChange={e => setFormData({...formData, gender: +e.target.value})} className="glass-select bg-black/60 py-2.5 rounded-xl border-white/5">
                              <option value={1}>Female</option>
                              <option value={2}>Male</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] text-white/50 uppercase tracking-widest font-mono mb-2">Weight (kg)</label>
                            <input type="number" value={formData.weight} onChange={e => setFormData({...formData, weight: +e.target.value})} className="glass-input bg-black/60 py-2.5 rounded-xl border-white/5" />
                          </div>
                        </div>
                      </div>

                      {/* Hemodynamics */}
                      <div className="space-y-4">
                        <h4 className="text-[10px] text-teal-400 font-mono tracking-widest uppercase border-b border-white/5 pb-2">Vascular Stress Indices</h4>
                        
                        <div>
                          <div className="flex justify-between mb-2">
                            <label className="text-[10px] text-white/50 uppercase tracking-widest font-mono">Systolic (mmHg)</label>
                            <span className="text-[10px] text-[#FF2D55] font-mono font-bold">{formData.ap_hi} mmHg</span>
                          </div>
                          <input type="range" min="90" max="200" value={formData.ap_hi} onChange={e => setFormData({...formData, ap_hi: +e.target.value})} className="w-full accent-[#FF2D55] h-1 rounded-lg appearance-none bg-white/5 cursor-pointer" />
                        </div>

                        <div>
                          <div className="flex justify-between mb-2">
                            <label className="text-[10px] text-white/50 uppercase tracking-widest font-mono">Diastolic (mmHg)</label>
                            <span className="text-[10px] text-[#FF2D55] font-mono font-bold">{formData.ap_lo} mmHg</span>
                          </div>
                          <input type="range" min="60" max="130" value={formData.ap_lo} onChange={e => setFormData({...formData, ap_lo: +e.target.value})} className="w-full accent-[#FF2D55] h-1 rounded-lg appearance-none bg-white/5 cursor-pointer" />
                        </div>
                      </div>

                      {/* Lab Attributes */}
                      <div className="space-y-4 md:col-span-2 pt-4 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-[9px] text-white/50 uppercase tracking-widest font-mono mb-2">Serum Lipid</label>
                          <select value={formData.cholesterol} onChange={e => setFormData({...formData, cholesterol: +e.target.value})} className="glass-select bg-black/60 rounded-xl border-white/5">
                            <option value={1}>Normal</option>
                            <option value={2}>Borderline</option>
                            <option value={3}>Critical</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[9px] text-white/50 uppercase tracking-widest font-mono mb-2">Glucose Index</label>
                          <select value={formData.gluc} onChange={e => setFormData({...formData, gluc: +e.target.value})} className="glass-select bg-black/60 rounded-xl border-white/5">
                            <option value={1}>Normal</option>
                            <option value={2}>Elevated</option>
                            <option value={3}>Diabetic</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[9px] text-white/50 uppercase tracking-widest font-mono mb-2">Tobacco Vector</label>
                          <select value={formData.smoke} onChange={e => setFormData({...formData, smoke: +e.target.value})} className="glass-select bg-black/60 rounded-xl border-white/5">
                            <option value={0}>No</option>
                            <option value={1}>Active</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[9px] text-white/50 uppercase tracking-widest font-mono mb-2">Active Profile</label>
                          <select value={formData.active} onChange={e => setFormData({...formData, active: +e.target.value})} className="glass-select bg-black/60 rounded-xl border-white/5">
                            <option value={1}>Active</option>
                            <option value={0}>Sedentary</option>
                          </select>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Predict CTA */}
                  <div className="mt-8 flex justify-center border-t border-white/5 pt-6">
                    <AnimatePresence mode="wait">
                      {isAnalyzing ? (
                        <motion.div 
                          key="analyzing"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col items-center gap-3 bg-black/60 border border-teal-400/20 rounded-2xl p-4 min-w-[280px]"
                        >
                          <div className="w-5 h-5 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
                          <span className="text-teal-400 font-mono text-[10px] tracking-wider text-center">{loadingMessages[analysisStep]}</span>
                        </motion.div>
                      ) : (
                        <motion.button
                          key="button"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          onClick={handlePredict}
                          className="group flex items-center gap-3 bg-gradient-to-r from-[#FF2D55] to-[#8B0000] hover:from-[#FF2D55] hover:to-[#FF2D55]/90 text-white font-bold rounded-full px-8 py-3.5 transition-all shadow-[0_10px_30px_rgba(255,45,85,0.25)] hover:-translate-y-0.5"
                        >
                          <Zap size={14} className="text-white animate-pulse" />
                          <span className="tracking-widest uppercase text-[10px]">Execute Diagnostic Scan</span>
                          <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Metric Importance Column */}
                <div className="lg:col-span-4 glass-card bg-[#0A0A0C]/75 border-white/5 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-teal-400/5 rounded-full blur-[80px] pointer-events-none -z-10" />

                  <div>
                    <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-6">
                      <span className="text-[#FF2D55] font-bold font-mono text-sm">[05]</span>
                      <h3 className="text-white font-bold uppercase tracking-widest text-xs">Model Telemetry</h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <span className="text-[9px] text-white/40 uppercase tracking-widest font-mono block mb-1">Classifier Weights</span>
                        <div className="space-y-2 pt-1">
                          <div className="flex justify-between text-[10px] font-mono">
                            <span className="text-white/60">Arterial Pressure</span>
                            <span className="text-teal-400">42.4%</span>
                          </div>
                          <div className="h-[1.5px] bg-white/5 w-full rounded overflow-hidden">
                            <div className="bg-teal-400 h-full w-[42.4%]" />
                          </div>

                          <div className="flex justify-between text-[10px] font-mono pt-1">
                            <span className="text-white/60">Age Index</span>
                            <span className="text-teal-400">23.8%</span>
                          </div>
                          <div className="h-[1.5px] bg-white/5 w-full rounded overflow-hidden">
                            <div className="bg-teal-400 h-full w-[23.8%]" />
                          </div>

                          <div className="flex justify-between text-[10px] font-mono pt-1">
                            <span className="text-white/60">Lipids Index</span>
                            <span className="text-[#FF2D55]">18.1%</span>
                          </div>
                          <div className="h-[1.5px] bg-white/5 w-full rounded overflow-hidden">
                            <div className="bg-[#FF2D55] h-full w-[18.1%]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5 mt-6 flex items-center gap-3 text-[9px] font-mono text-white/40">
                    <BarChart2 size={12} className="text-[#FF2D55]" />
                    <span>BENCHMARK // ROC-AUC: 98.42%</span>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* 2. CLINICAL RESULTS DISPLAY */}
      <AnimatePresence>
        {analysisComplete && result && (
          <section id="clinical-results" className="relative z-20 bg-[#050505] py-20 border-t border-white/5">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
              <div className="mb-10 text-center md:text-left">
                <span className="text-xs text-teal-400 font-mono tracking-[0.25em] uppercase block mb-2">Biocore Diagnostics // Neural Predictor</span>
                <h2 className="text-3xl font-bold text-white tracking-tight">Systemic Diagnostic Report</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Diagnostic Classification */}
                <div className={`glass-card bg-[#0A0A0C]/50 border-white/5 p-10 flex flex-col justify-between ${isHighRisk ? 'border-[#FF2D55]/30' : 'border-teal-400/20'}`}>
                  <div>
                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono block mb-6">Outcome Flag</span>
                    {isHighRisk ? (
                      <div className="space-y-4">
                        <div className="inline-flex items-center gap-3 bg-red-950/20 border border-red-500/20 text-[#FF2D55] px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-widest">
                          <FileWarning size={16} />
                          <span>Elevated Strain Flagged</span>
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed font-light">
                          Patient metrics heavily correlate with elevated cardiodynamics strain. Direct clinical imaging, therapeutic lipid mitigation, and hemodynamic monitoring are advised.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="inline-flex items-center gap-3 bg-teal-950/20 border border-teal-500/20 text-teal-400 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-widest">
                          <CheckCircle2 size={16} />
                          <span>Optimal Baseline</span>
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed font-light">
                          Calculated predictive parameters lie securely within healthy clinical reference standards. Maintain stable physical profiling tracks.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-white/5 mt-8 text-xs font-mono text-white/40 flex justify-between">
                    <span>Model Confidence Rating</span>
                    <span className="text-white font-bold">{confidence}% Confidence</span>
                  </div>
                </div>

                {/* Absolute Probability Gauge */}
                <div className="glass-card bg-[#0A0A0C]/50 border-white/5 p-10 flex flex-col justify-center items-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,214,255,0.02),transparent_70%)] pointer-events-none" />
                  <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono block mb-10 text-center w-full">Absolute Probability Analysis</span>
                  
                  <div className="relative h-44 flex items-end justify-center overflow-hidden w-full max-w-[280px]">
                    <div className="absolute top-0 w-full h-[280px] rounded-full border-[10px] border-white/5 border-b-transparent border-l-transparent -rotate-45" />
                    
                    <motion.div 
                      initial={{ rotate: -45 }}
                      animate={{ rotate: -45 + (result.risk_probability / 100) * 180 }}
                      transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
                      className={`absolute top-0 w-full h-[280px] rounded-full border-[10px] border-b-transparent border-l-transparent -rotate-45 ${isHighRisk ? 'border-[#FF2D55]' : 'border-teal-400'}`}
                      style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)', filter: `drop-shadow(0 0 20px ${isHighRisk ? 'rgba(255,45,85,0.4)' : 'rgba(0,214,255,0.4)'})` }}
                    />
                    
                    <div className="absolute bottom-0 text-center pb-2 flex flex-col items-center">
                      <span className="text-6xl font-black text-white tracking-tighter drop-shadow-md">{riskProb}%</span>
                      <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest mt-2">Cardiac Strain Coefficient</span>
                    </div>
                  </div>
                </div>

                {/* Primary Physiological Observations */}
                <div className="glass-card bg-[#0A0A0C]/50 border-white/5 p-10 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono block mb-8">Physiochemical Observations</span>
                    
                    <div className="space-y-6">
                      {formData.ap_hi >= 130 ? (
                        <div className="flex gap-4">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#FF2D55] mt-2 shrink-0 shadow-[0_0_8px_rgba(255,45,85,0.8)]" />
                          <div>
                            <h4 className="text-white text-sm font-semibold mb-1">Hypertensive Shearing Strain</h4>
                            <p className="text-white/40 text-xs leading-relaxed">Systemic pressure compounds microvascular calcification and arterial wall stiffening.</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-4">
                          <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-2 shrink-0 shadow-[0_0_8px_rgba(0,214,255,0.8)]" />
                          <div>
                            <h4 className="text-white text-sm font-semibold mb-1">Stable Arterial Pressure</h4>
                            <p className="text-white/40 text-xs leading-relaxed">Hemodynamic flow forces within healthy reference boundaries.</p>
                          </div>
                        </div>
                      )}

                      {formData.cholesterol > 1 ? (
                        <div className="flex gap-4">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#FF2D55] mt-2 shrink-0 shadow-[0_0_8px_rgba(255,45,85,0.8)]" />
                          <div>
                            <h4 className="text-white text-sm font-semibold mb-1">Lipid Plaque Saturation</h4>
                            <p className="text-white/40 text-xs leading-relaxed">High serum concentration facilitates lipid plaque deposition in essential arteries.</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-4">
                          <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-2 shrink-0 shadow-[0_0_8px_rgba(0,214,255,0.8)]" />
                          <div>
                            <h4 className="text-white text-sm font-semibold mb-1">Normalized Lipid Profiles</h4>
                            <p className="text-white/40 text-xs leading-relaxed">Serum lipid parameters match standard baseline healthy references.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>
        )}
      </AnimatePresence>

      {/* 3. CHAPTER 1: THE PATHOLOGY OF ARTERIAL STRESS */}
      <section className="relative bg-[#08080A] py-32 border-t border-white/5 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-br from-[#8B0000]/5 to-transparent rounded-full blur-[160px] pointer-events-none" />
        
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.01] pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div>
              <div className="inline-flex items-center gap-3 bg-[#FF2D55]/10 border border-[#FF2D55]/20 rounded-full px-4 py-1.5 mb-6">
                <span className="text-[10px] text-[#FF2D55] font-mono tracking-widest uppercase">Chapter 01 // Structural Pathology</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
                The Dynamics of <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#FF2D55]">Arterial Degradation.</span>
              </h2>
              
              <p className="text-white/70 text-base font-light leading-relaxed mb-6">
                Cardiovascular stress represents a slow, progressive degradation of the vascular architecture, accelerating significantly under metabolic strain.
              </p>

              <div className="space-y-6 pt-2">
                <div className="flex gap-4 items-start">
                  <div className="p-2 bg-red-950/20 border border-red-500/20 text-[#FF2D55] rounded-xl"><HeartPulse size={18} /></div>
                  <div>
                    <h4 className="text-white font-bold text-sm mb-1">Shearing Strain & Wall Stress</h4>
                    <p className="text-white/40 text-xs leading-relaxed font-light">Elevated hemodynamic pressure causes microvascular tears in the delicate endothelial membranes of critical coronary arteries.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="p-2 bg-red-950/20 border border-red-500/20 text-[#FF2D55] rounded-xl"><Dna size={18} /></div>
                  <div>
                    <h4 className="text-white font-bold text-sm mb-1">Calcified Lipid Plaque Accumulation</h4>
                    <p className="text-white/40 text-xs leading-relaxed font-light">Low-density lipid cells slip beneath the damaged membranes, calcifying into hard plaque blocks (atherosclerosis).</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Artery Diagram with UI Overlays */}
            <div className="relative h-[400px] w-full rounded-3xl overflow-hidden border border-white/5 bg-[#0C0C0E] shadow-[0_20px_50px_rgba(0,0,0,0.6)] group">
              <Image 
                src="/assets/narrowing_of_coronary_artery.png" 
                alt="Atherosclerosis Progression Diagram"
                fill
                className="object-cover opacity-75 group-hover:scale-105 transition-transform duration-[2000ms]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              
              <div className="absolute top-6 left-6 flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
                <span className="w-1.5 h-1.5 bg-[#FF2D55] rounded-full animate-ping" />
                <span className="text-[10px] text-white font-mono uppercase tracking-widest">Stenosis Index: 74%</span>
              </div>

              <div className="absolute bottom-6 right-6 max-w-xs bg-black/80 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/5">
                <span className="text-[9px] text-[#FF2D55] font-mono tracking-widest uppercase block mb-1">Pathology Observation</span>
                <p className="text-white font-semibold text-xs leading-normal">
                  Lumen narrowing triggers localized blood velocity spikes, actively compounding wall shearing stress.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. CHAPTER 2: TOXIC & LIFESTYLE ATTRIBUTION */}
      <section className="relative bg-[#050505] py-32 border-t border-white/5 overflow-hidden">
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-teal-500/5 to-transparent rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Diagram first (Left side for layout rhythm) */}
            <div className="relative h-[400px] w-full rounded-3xl overflow-hidden border border-white/5 bg-[#0C0C0E] shadow-[0_20px_50px_rgba(0,0,0,0.6)] group lg:order-first order-last">
              <Image 
                src="/assets/types_of_heart_disease.png" 
                alt="Myocardial Pathology Diagrams"
                fill
                className="object-cover opacity-70 group-hover:scale-105 transition-transform duration-[2000ms]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 max-w-sm bg-black/80 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/5">
                <span className="text-[9px] text-teal-400 font-mono tracking-widest uppercase block mb-1">Vascular Telemetry</span>
                <p className="text-white font-semibold text-xs leading-normal">
                  Chronic ischemia results from microvascular oxygen starvation. Real-time diagnostic mapping aids recovery tracks.
                </p>
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-3 bg-teal-950/20 border border-teal-500/20 rounded-full px-4 py-1.5 mb-6">
                <span className="text-[10px] text-teal-400 font-mono tracking-widest uppercase">Chapter 02 // Metabolic & Toxic Pathways</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
                Chemical Profiles & <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-teal-300">Endothelial Toxicity.</span>
              </h2>
              
              <p className="text-white/70 text-base font-light leading-relaxed mb-6">
                The introduction of toxic profiles such as tobacco instantly compromises vascular safety parameters, driving cellular vascular degradation.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="glass-card bg-[#0A0A0C]/30 p-6 rounded-2xl border-white/5">
                  <Wind className="text-[#FF2D55] mb-3" size={20} />
                  <h4 className="text-white font-bold text-sm mb-1">Tobacco Toxicity</h4>
                  <p className="text-xs text-white/50 leading-relaxed font-light">
                    Nicotine facilitates severe vasoconstriction, while carbon monoxide starves myocardium of precious oxygen.
                  </p>
                </div>

                <div className="glass-card bg-[#0A0A0C]/30 p-6 rounded-2xl border-white/5">
                  <TrendingUp className="text-teal-400 mb-3" size={20} />
                  <h4 className="text-white font-bold text-sm mb-1">Glycemic Stress</h4>
                  <p className="text-xs text-white/50 leading-relaxed font-light">
                    Sustained blood glucose levels chemically react with vital proteins, inducing vascular calcification and membrane stiffening.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. CHAPTER 3: THE PATH TO RECOVERY (Hope and Restorative Emerald tones) */}
      <section className="relative bg-[#060A0D] py-40 border-t border-white/5 overflow-hidden">
        
        {/* Active runner backdrop overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/assets/media__1779492571042.jpg" 
            alt="Recovery Runner Silhouette Backdrop"
            fill
            className="object-cover opacity-[0.14] mix-blend-screen scale-105 origin-bottom pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(45,212,191,0.15),transparent_70%)] pointer-events-none" />
        </div>

        <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10 text-center">
          
          <div className="inline-flex items-center gap-3 bg-teal-950/30 border border-teal-400/30 rounded-full px-4 py-1.5 mb-6">
            <Users className="text-teal-400 animate-pulse" size={14} />
            <span className="text-[10px] text-teal-400 font-mono tracking-widest uppercase">Chapter 03 // Human Resonance & Hope</span>
          </div>

          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
            The Path to Recovery.
          </h2>
          
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto mb-16 font-light">
            Physiology is highly resilient. Engineered lifestyle protocols can completely stabilize, heal, and reverse vascular stress coefficients.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-4xl mx-auto">
            
            <div className="glass-card bg-[#0A0A0C]/50 backdrop-blur-xl border-white/10 hover:border-teal-400/30 transition-all rounded-[2rem] p-10">
              <div className="p-3 bg-teal-400/10 rounded-xl inline-block mb-6">
                <RefreshCw className="text-teal-400" size={24} />
              </div>
              <h4 className="text-white font-bold text-lg mb-2">Vasodilation & Angiogenesis</h4>
              <p className="text-xs text-white/50 leading-relaxed font-light">
                Consistent cardiovascular engagement shifts local pressure strain. Capillary vascular networks actively expand, lowering peripheral resistance and restoring active flows.
              </p>
            </div>

            <div className="glass-card bg-[#0A0A0C]/50 backdrop-blur-xl border-white/10 hover:border-teal-400/30 transition-all rounded-[2rem] p-10">
              <div className="p-3 bg-teal-400/10 rounded-xl inline-block mb-6">
                <CheckCircle2 className="text-teal-400" size={24} />
              </div>
              <h4 className="text-white font-bold text-lg mb-2">Endothelial Regeneration</h4>
              <p className="text-xs text-white/50 leading-relaxed font-light">
                Eliminating metabolic toxins (active smoking) and managing lipid indices allows vascular membranes to complete natural self-repair loops, actively restoring elasticity.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 6. EMOTIONAL RESOLUTION FOOTER */}
      <footer className="relative z-20 bg-[#050505] border-t border-white/5 overflow-hidden">
        
        {/* Styled sunrise cityscape overlay */}
        <div className="absolute inset-x-0 bottom-0 h-[60vh] opacity-[0.08] mix-blend-screen pointer-events-none">
          <Image 
            src="/assets/media__1779492601840.png" 
            alt="Peaceful Sunrise Cityscape"
            fill
            className="object-cover object-bottom"
          />
        </div>

        <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-24 pb-12 relative z-10">
          
          {/* Stabilized Heart Telemetry */}
          <div className="flex flex-col items-center justify-center text-center mb-20">
            <span className="text-[10px] text-teal-400 font-mono tracking-[0.25em] uppercase block mb-3">Active Sinus Rhythm Telemetry</span>
            
            <div className="flex items-center gap-6 text-white font-mono mb-6 bg-teal-950/10 px-6 py-2.5 rounded-full border border-teal-500/10 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
                <span className="text-teal-400 font-bold">60 BPM</span>
              </div>
              <span className="text-white/20">|</span>
              <span>SINUS RHYTHM: STABILIZED</span>
            </div>

            <svg width="320" height="40" className="opacity-40">
              <path d="M0,20 L100,20 L110,5 L120,35 L130,20 L320,20" fill="none" stroke="#2dd4bf" strokeWidth="2" strokeDasharray="6 6" />
            </svg>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 pt-16 border-t border-white/5">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-white font-bold tracking-[0.25em] text-sm uppercase">BIOCORE</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF2D55] shadow-[0_0_8px_rgba(255,45,85,0.6)]" />
              </div>
              <p className="text-white/30 text-xs max-w-md font-light leading-relaxed">
                An immersive scrollytelling platform combining machine learning diagnostics, high-fidelity biological sequences, and patient recovery indicators.
              </p>
            </div>
            
            <div className="text-left md:text-right space-y-4">
              <span className="text-[10px] text-white/30 font-mono tracking-widest uppercase block">BIOCORE // VERIFIED PRODUCTION</span>
              <div className="flex flex-wrap gap-2 text-[10px] font-mono text-white/50 justify-start md:justify-end">
                <span className="bg-white/5 px-3 py-1.5 rounded-md">Next.js 16</span>
                <span className="bg-white/5 px-3 py-1.5 rounded-md">Framer Motion</span>
                <span className="bg-white/5 px-3 py-1.5 rounded-md">FastAPI Stack</span>
                <span className="bg-white/5 px-3 py-1.5 rounded-md">XGBoost 2.0</span>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center text-[10px] text-white/20 font-mono">
            © {new Date().getFullYear()} BIOCORE SYSTEMS LLC. ALL RIGHTS RESERVED.
          </div>

        </div>
      </footer>

    </main>
  );
}
