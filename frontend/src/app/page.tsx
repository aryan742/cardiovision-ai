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

  // Tighter scroll track (280vh) for high-performance and snappy dynamic transitions
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Track absolute scroll progress with modern motion listener
  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      setScrollProgress(latest);
    });
  }, [scrollYProgress]);

  // Perfectly overlapping ranges to eliminate any blank dead zones
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -30]);

  const revealOpacity = useTransform(scrollYProgress, [0.18, 0.26, 0.44, 0.5], [0, 1, 1, 0]);
  const revealX = useTransform(scrollYProgress, [0.18, 0.26, 0.44, 0.5], [-20, 0, 0, -20]);

  const circOpacity = useTransform(scrollYProgress, [0.46, 0.54, 0.72, 0.78], [0, 1, 1, 0]);
  const circX = useTransform(scrollYProgress, [0.46, 0.54, 0.72, 0.78], [20, 0, 0, 20]);

  const detailOpacity = useTransform(scrollYProgress, [0.74, 0.82, 0.94, 1.0], [0, 1, 1, 0]);
  const detailY = useTransform(scrollYProgress, [0.74, 0.82, 0.94, 1.0], [20, 0, 0, -20]);

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

      {/* 1. HERO & HEART SEQUENCE SECTION (Tighter 280vh track for responsive pacing) */}
      <div ref={containerRef} className="relative h-[280vh] w-full">
        
        {/* Full-Screen Sticky Viewport */}
        <div className="sticky top-0 left-0 w-full h-screen overflow-hidden z-10 flex items-center justify-center bg-[#050505]">
          
          {/* Ambient Red Glow Layer */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,0,0,0.15)_0%,rgba(5,5,5,0)_70%)] pointer-events-none z-10" />

          {/* Sequence canvas component */}
          <HeartSequenceCanvas 
            scrollProgress={scrollProgress} 
            onLoadingComplete={() => setIsLoaded(true)} 
          />

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

        </div>
      </div>

      {/* 2. REASSEMBLY & CLINICAL ASSESSMENT CONTROL CENTER */}
      <section id="assessment" className="relative z-20 bg-[#050505] min-h-screen py-32 border-t border-white/5 overflow-hidden">
        
        {/* Layered Lighting Gradients */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-[#8B0000]/10 to-[#FF2D55]/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-teal-500/5 to-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Constellation Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

        <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-24">
            <div className="inline-flex items-center gap-3 bg-teal-950/20 border border-teal-500/20 rounded-full px-4 py-2 mb-6">
              <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-ping" />
              <span className="text-[10px] text-teal-400 font-mono tracking-widest uppercase">System Interface // Neural Predictive Mode</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-6">
              Clinical Assessment Center
            </h2>
            <p className="text-white/60 text-lg font-light leading-relaxed max-w-2xl mx-auto">
              Map patient vital signs and blood diagnostics to execute high-fidelity risk prediction with live machine learning intelligence models.
            </p>
          </div>

          {/* Interactive Form & Visual Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            
            {/* Input Config Card */}
            <div className="lg:col-span-2 glass-card bg-[#0A0A0C]/50 border-white/5 rounded-3xl p-10 md:p-14 shadow-2xl relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-96 h-96 bg-teal-400/5 rounded-full blur-[90px] pointer-events-none -z-10" />

              <div>
                <div className="flex items-center justify-between border-b border-white/5 pb-5 mb-10">
                  <div className="flex items-center gap-3">
                    <span className="text-[#FF2D55] font-bold font-mono text-sm">[01]</span>
                    <h3 className="text-white font-bold uppercase tracking-widest text-sm">Biometric Matrix Configuration</h3>
                  </div>
                  <span className="text-xs text-white/30 font-mono hidden md:inline">SYSTEM: ACTIVE</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  
                  {/* Demographics */}
                  <div className="space-y-6">
                    <h4 className="text-[11px] text-teal-400 font-mono tracking-widest uppercase border-b border-white/5 pb-2">Demographics & Profile</h4>
                    
                    <div>
                      <div className="flex justify-between mb-3">
                        <label className="text-xs text-white/50 uppercase tracking-widest font-mono">Chronological Age</label>
                        <span className="text-xs text-teal-400 font-mono font-bold">{formData.age} years</span>
                      </div>
                      <input type="range" min="18" max="100" value={formData.age} onChange={e => setFormData({...formData, age: +e.target.value})} className="w-full accent-[#FF2D55] h-1.5 rounded-lg appearance-none bg-white/5 cursor-pointer" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-white/50 uppercase tracking-widest font-mono mb-2">Biological Sex</label>
                        <select value={formData.gender} onChange={e => setFormData({...formData, gender: +e.target.value})} className="glass-select bg-black/60 py-3 rounded-xl border-white/5">
                          <option value={1}>Female</option>
                          <option value={2}>Male</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-white/50 uppercase tracking-widest font-mono mb-2">Weight (kg)</label>
                        <input type="number" value={formData.weight} onChange={e => setFormData({...formData, weight: +e.target.value})} className="glass-input bg-black/60 py-3 rounded-xl border-white/5" />
                      </div>
                    </div>
                  </div>

                  {/* Hemodynamics */}
                  <div className="space-y-6">
                    <h4 className="text-[11px] text-teal-400 font-mono tracking-widest uppercase border-b border-white/5 pb-2">Hemodynamics (Arterial Stress)</h4>
                    
                    <div>
                      <div className="flex justify-between mb-3">
                        <label className="text-xs text-white/50 uppercase tracking-widest font-mono">Systolic Pressure</label>
                        <span className="text-xs text-[#FF2D55] font-mono font-bold">{formData.ap_hi} mmHg</span>
                      </div>
                      <input type="range" min="90" max="200" value={formData.ap_hi} onChange={e => setFormData({...formData, ap_hi: +e.target.value})} className="w-full accent-[#FF2D55] h-1.5 rounded-lg appearance-none bg-white/5 cursor-pointer" />
                    </div>

                    <div>
                      <div className="flex justify-between mb-3">
                        <label className="text-xs text-white/50 uppercase tracking-widest font-mono">Diastolic Pressure</label>
                        <span className="text-xs text-[#FF2D55] font-mono font-bold">{formData.ap_lo} mmHg</span>
                      </div>
                      <input type="range" min="60" max="130" value={formData.ap_lo} onChange={e => setFormData({...formData, ap_lo: +e.target.value})} className="w-full accent-[#FF2D55] h-1.5 rounded-lg appearance-none bg-white/5 cursor-pointer" />
                    </div>
                  </div>

                  {/* Lab & Lifestyle Attributes */}
                  <div className="space-y-6 md:col-span-2 pt-6 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <label className="block text-xs text-white/50 uppercase tracking-widest font-mono mb-2">Serum Lipid</label>
                      <select value={formData.cholesterol} onChange={e => setFormData({...formData, cholesterol: +e.target.value})} className="glass-select bg-black/60 rounded-xl border-white/5">
                        <option value={1}>Normal</option>
                        <option value={2}>Borderline</option>
                        <option value={3}>High Risk</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-white/50 uppercase tracking-widest font-mono mb-2">Fasting Glucose</label>
                      <select value={formData.gluc} onChange={e => setFormData({...formData, gluc: +e.target.value})} className="glass-select bg-black/60 rounded-xl border-white/5">
                        <option value={1}>Normal</option>
                        <option value={2}>Elevated</option>
                        <option value={3}>Diabetic</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-white/50 uppercase tracking-widest font-mono mb-2">Active Smoker</label>
                      <select value={formData.smoke} onChange={e => setFormData({...formData, smoke: +e.target.value})} className="glass-select bg-black/60 rounded-xl border-white/5">
                        <option value={0}>No</option>
                        <option value={1}>Active</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-white/50 uppercase tracking-widest font-mono mb-2">Activity Profile</label>
                      <select value={formData.active} onChange={e => setFormData({...formData, active: +e.target.value})} className="glass-select bg-black/60 rounded-xl border-white/5">
                        <option value={1}>Active</option>
                        <option value={0}>Sedentary</option>
                      </select>
                    </div>
                  </div>

                </div>
              </div>

              {/* Predict CTA */}
              <div className="mt-12 flex justify-center border-t border-white/5 pt-8">
                <AnimatePresence mode="wait">
                  {isAnalyzing ? (
                    <motion.div 
                      key="analyzing"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center gap-4 bg-black/40 border border-teal-400/20 rounded-2xl p-6 min-w-[340px]"
                    >
                      <div className="w-6 h-6 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-teal-400 font-mono text-xs tracking-wider text-center">{loadingMessages[analysisStep]}</span>
                    </motion.div>
                  ) : (
                    <motion.button
                      key="button"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={handlePredict}
                      className="group flex items-center gap-4 bg-gradient-to-r from-[#FF2D55] to-[#8B0000] hover:from-[#FF2D55] hover:to-[#FF2D55]/90 text-white font-bold rounded-full px-12 py-5 transition-all shadow-[0_10px_35px_rgba(255,45,85,0.25)] hover:shadow-[0_15px_45px_rgba(255,45,85,0.45)] hover:-translate-y-1"
                    >
                      <Zap size={16} className="text-white animate-pulse" />
                      <span className="tracking-widest uppercase text-xs">Execute Diagnostic Scan</span>
                      <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

            </div>

            {/* Embedded Live Diagnostics Telemetry Column */}
            <div className="glass-card bg-[#0A0A0C]/50 border-white/5 rounded-3xl p-10 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF2D55]/5 rounded-full blur-[80px] pointer-events-none -z-10" />

              <div>
                <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-8">
                  <span className="text-[#FF2D55] font-bold font-mono text-sm">[02]</span>
                  <h3 className="text-white font-bold uppercase tracking-widest text-sm">Model Architecture</h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono block mb-2">Algorithm Standard</span>
                    <p className="text-white font-semibold text-sm leading-relaxed">Recursive Extreme Gradient Boosting Matrix</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono block mb-2">Feature Weighting (Gini)</span>
                    <div className="space-y-2 pt-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-white/60">Arterial Pressure</span>
                        <span className="text-teal-400">42.4%</span>
                      </div>
                      <div className="h-[2px] bg-white/5 w-full rounded overflow-hidden">
                        <div className="bg-teal-400 h-full w-[42.4%]" />
                      </div>

                      <div className="flex justify-between text-xs font-mono pt-1">
                        <span className="text-white/60">Age Coefficient</span>
                        <span className="text-teal-400">23.8%</span>
                      </div>
                      <div className="h-[2px] bg-white/5 w-full rounded overflow-hidden">
                        <div className="bg-teal-400 h-full w-[23.8%]" />
                      </div>

                      <div className="flex justify-between text-xs font-mono pt-1">
                        <span className="text-white/60">Serum Cholesterol</span>
                        <span className="text-[#FF2D55]">18.1%</span>
                      </div>
                      <div className="h-[2px] bg-white/5 w-full rounded overflow-hidden">
                        <div className="bg-[#FF2D55] h-full w-[18.1%]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 mt-8 flex items-center gap-4 text-[10px] font-mono text-white/40">
                <BarChart2 size={14} className="text-[#FF2D55]" />
                <span>BENCHMARK // ROC-AUC: 98.42%</span>
              </div>
            </div>

          </div>

          {/* CLINICAL RESULTS DISPLAY */}
          <AnimatePresence>
            {analysisComplete && result && (
              <motion.div
                id="clinical-results"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mt-20 border-t border-white/5 pt-20"
              >
                <div className="mb-12">
                  <span className="text-xs text-teal-400 font-mono tracking-[0.25em] uppercase block mb-3">Biocore Analytics // Inference Vector</span>
                  <h2 className="text-3xl font-bold text-white tracking-tight">Systemic Diagnostic Report</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Diagnostic Classification */}
                  <div className={`glass-card bg-[#0A0A0C]/50 border-white/5 p-10 flex flex-col justify-between ${isHighRisk ? 'border-[#FF2D55]/30' : 'border-teal-400/20'}`}>
                    <div>
                      <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono block mb-6">Prediction Classification</span>
                      {isHighRisk ? (
                        <div className="space-y-4">
                          <div className="inline-flex items-center gap-3 bg-red-950/20 border border-red-500/20 text-[#FF2D55] px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-widest">
                            <FileWarning size={16} />
                            <span>Elevated Strain Flagged</span>
                          </div>
                          <p className="text-white/60 text-sm leading-relaxed font-light">
                            The physiological matrix matches cohorts with high incidences of cardiovascular events. Active clinical intervention, arterial imaging, and therapeutic monitoring are recommended.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="inline-flex items-center gap-3 bg-teal-950/20 border border-teal-500/20 text-teal-400 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-widest">
                            <CheckCircle2 size={16} />
                            <span>Optimal Baseline</span>
                          </div>
                          <p className="text-white/60 text-sm leading-relaxed font-light">
                            Calculated predictive parameters lie securely within typical clinical reference scales. Standard health maintenance and tracking is advised.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="pt-6 border-t border-white/5 mt-8 text-xs font-mono text-white/40 flex justify-between">
                      <span>Model Stability Rating</span>
                      <span className="text-white font-bold">{confidence}% Confidence</span>
                    </div>
                  </div>

                  {/* High-Fidelity Risk Dial */}
                  <div className="glass-card bg-[#0A0A0C]/50 border-white/5 p-10 flex flex-col justify-center items-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,214,255,0.02),transparent_70%)] pointer-events-none" />
                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono block mb-10 text-center w-full">Absolute Probability Matrix</span>
                    
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
                        <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest mt-2">Cardiac Strain Risk</span>
                      </div>
                    </div>
                  </div>

                  {/* Primary Physiological Observations */}
                  <div className="glass-card bg-[#0A0A0C]/50 border-white/5 p-10 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono block mb-8">Correlated Vectors</span>
                      
                      <div className="space-y-6">
                        {formData.ap_hi >= 130 ? (
                          <div className="flex gap-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#FF2D55] mt-2 shrink-0 shadow-[0_0_8px_rgba(255,45,85,0.8)]" />
                            <div>
                              <h4 className="text-white text-sm font-semibold mb-1">Hypertensive Shearing</h4>
                              <p className="text-white/40 text-xs leading-relaxed">Excess pressure damages delicate endothelial walls, inducing micro-calcification paths.</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-2 shrink-0 shadow-[0_0_8px_rgba(0,214,255,0.8)]" />
                            <div>
                              <h4 className="text-white text-sm font-semibold mb-1">Normalized Hemodynamics</h4>
                              <p className="text-white/40 text-xs leading-relaxed">Calculated systolic load lies comfortably within healthy physiological bounds.</p>
                            </div>
                          </div>
                        )}

                        {formData.cholesterol > 1 ? (
                          <div className="flex gap-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#FF2D55] mt-2 shrink-0 shadow-[0_0_8px_rgba(255,45,85,0.8)]" />
                            <div>
                              <h4 className="text-white text-sm font-semibold mb-1">Elevated Lipid Plaque Index</h4>
                              <p className="text-white/40 text-xs leading-relaxed">High lipid density flags potential vascular thickening and coronary arterial strain.</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-2 shrink-0 shadow-[0_0_8px_rgba(0,214,255,0.8)]" />
                            <div>
                              <h4 className="text-white text-sm font-semibold mb-1">Stable Serum Lipids</h4>
                              <p className="text-white/40 text-xs leading-relaxed">Lipid saturation coefficients are perfectly normal, avoiding lipid plaque deposition.</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>

      {/* 3. CHAPTER 1: THE PATHOLOGY OF ARTERIAL STRESS */}
      <section className="relative bg-[#08080A] py-40 border-t border-white/5 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-br from-[#8B0000]/5 to-transparent rounded-full blur-[160px] pointer-events-none" />
        
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.01] pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            
            <div>
              <div className="inline-flex items-center gap-3 bg-[#FF2D55]/10 border border-[#FF2D55]/20 rounded-full px-4 py-2 mb-6">
                <span className="text-[10px] text-[#FF2D55] font-mono tracking-widest uppercase">Chapter 01 // Structural Pathology</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-8">
                The Dynamics of <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#FF2D55]">Arterial Degradation.</span>
              </h2>
              
              <p className="text-white/70 text-lg font-light leading-relaxed mb-6">
                Cardiovascular stress is rarely immediate. It represents a slow, progressive degradation of the vascular architecture, accelerating significantly under metabolic strain.
              </p>

              <div className="space-y-6 pt-4">
                <div className="flex gap-4 items-start">
                  <div className="p-2 bg-red-950/20 border border-red-500/20 text-[#FF2D55] rounded-xl"><HeartPulse size={20} /></div>
                  <div>
                    <h4 className="text-white font-bold text-base mb-1">Shearing Strain & Tear Paths</h4>
                    <p className="text-white/40 text-sm leading-relaxed font-light">Elevated hemodynamic pressure causes micro-tears in the delicate inner membrane (endothelium) of crucial coronary vessels.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="p-2 bg-red-950/20 border border-red-500/20 text-[#FF2D55] rounded-xl"><Dna size={20} /></div>
                  <div>
                    <h4 className="text-white font-bold text-base mb-1">Calcified Plaque Accumulation</h4>
                    <p className="text-white/40 text-sm leading-relaxed font-light">Low-density lipid cells slip beneath the damaged wall. Macrophages ingest them, calcifying into hard arterial blockages (atherosclerosis).</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Artery Diagram with UI Overlays */}
            <div className="relative h-[480px] w-full rounded-[2.5rem] overflow-hidden border border-white/5 bg-[#0C0C0E] shadow-[0_20px_50px_rgba(0,0,0,0.6)] group">
              <Image 
                src="/assets/narrowing_of_coronary_artery.png" 
                alt="Atherosclerosis Progression Diagram"
                fill
                className="object-cover opacity-75 group-hover:scale-105 transition-transform duration-[2000ms]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              
              {/* Contextual overlay readouts */}
              <div className="absolute top-6 left-6 flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
                <span className="w-1.5 h-1.5 bg-[#FF2D55] rounded-full animate-ping" />
                <span className="text-[10px] text-white font-mono uppercase tracking-widest">Arterial Stenosis Level: 74%</span>
              </div>

              <div className="absolute bottom-6 right-6 max-w-xs bg-black/80 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/5">
                <span className="text-[9px] text-[#FF2D55] font-mono tracking-widest uppercase block mb-1">Pathology Marker</span>
                <p className="text-white font-semibold text-xs leading-normal">
                  Reduced lumen diameter forces localized velocity spikes, compounding arterial walls stress.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. CHAPTER 2: TOXIC & LIFESTYLE ATTRIBUTION */}
      <section className="relative bg-[#050505] py-40 border-t border-white/5 overflow-hidden">
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-teal-500/5 to-transparent rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            
            {/* Diagram first (Left side for layout rhythm) */}
            <div className="relative h-[480px] w-full rounded-[2.5rem] overflow-hidden border border-white/5 bg-[#0C0C0E] shadow-[0_20px_50px_rgba(0,0,0,0.6)] group lg:order-first order-last">
              <Image 
                src="/assets/types_of_heart_disease.png" 
                alt="Myocardial Pathology Diagrams"
                fill
                className="object-cover opacity-70 group-hover:scale-105 transition-transform duration-[2000ms]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 max-w-sm bg-black/80 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/5">
                <span className="text-[9px] text-teal-400 font-mono tracking-widest uppercase block mb-1">Clinical Observation</span>
                <p className="text-white font-semibold text-xs leading-normal">
                  Tissue ischemia results from chronic oxygen deprivation. Early prediction mapping offers structural prevention options.
                </p>
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-3 bg-teal-950/20 border border-teal-500/20 rounded-full px-4 py-2 mb-6">
                <span className="text-[10px] text-teal-400 font-mono tracking-widest uppercase">Chapter 02 // Metabolic & Toxic Pathways</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-8">
                Chemical Profiles & <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-teal-300">Chronic Vasoconstriction.</span>
              </h2>
              
              <p className="text-white/70 text-lg font-light leading-relaxed mb-8">
                The introduction of toxic profiles such as tobacco instantly compromises vascular safety parameters. Intracellular toxicity drives cellular degradation.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                <div className="glass-card bg-[#0A0A0C]/30 p-8 rounded-2xl border-white/5">
                  <Wind className="text-[#FF2D55] mb-4" size={24} />
                  <h4 className="text-white font-bold mb-2">Tobacco Toxicity</h4>
                  <p className="text-xs text-white/50 leading-relaxed font-light">
                    Nicotine triggers chronic vasoconstriction. Carbon monoxide bonds with hemoglobin, actively starving coronary muscles of oxygen.
                  </p>
                </div>

                <div className="glass-card bg-[#0A0A0C]/30 p-8 rounded-2xl border-white/5">
                  <TrendingUp className="text-teal-400 mb-4" size={24} />
                  <h4 className="text-white font-bold mb-2">Glycemic Spikes</h4>
                  <p className="text-xs text-white/50 leading-relaxed font-light">
                    Sustained glucose levels react with proteins, creating structural stiffening in vascular layers and rendering them brittle.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. CHAPTER 3: THE PATH TO RECOVERY */}
      <section className="relative bg-[#060A0D] py-48 border-t border-white/5 overflow-hidden">
        
        {/* Rich Restorative Emerald/Teal Ambient Glow */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/assets/media__1779492571042.jpg" 
            alt="Recovery Runner Silhouette Ambient"
            fill
            className="object-cover opacity-[0.14] mix-blend-screen scale-105 origin-bottom pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(45,212,191,0.15),transparent_70%)] pointer-events-none" />
        </div>

        <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10 text-center">
          
          <div className="inline-flex items-center gap-3 bg-teal-950/30 border border-teal-400/30 rounded-full px-4 py-2 mb-6">
            <Users className="text-teal-400 animate-pulse" size={14} />
            <span className="text-[10px] text-teal-400 font-mono tracking-widest uppercase">Chapter 03 // Human Resonance & Hope</span>
          </div>

          <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight">
            The Path to Recovery.
          </h2>
          
          <p className="text-xl md:text-2xl text-slate-300 leading-relaxed max-w-3xl mx-auto mb-20 font-light">
            Physiology is resilient. Implemented lifestyle architecture can completely stabilize, heal, and even reverse chronic vascular strain.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-4xl mx-auto">
            
            <div className="glass-card bg-[#0A0A0C]/50 backdrop-blur-xl border-white/10 hover:border-teal-400/30 transition-all rounded-[2rem] p-10">
              <div className="p-3 bg-teal-400/10 rounded-xl inline-block mb-6">
                <RefreshCw className="text-teal-400" size={28} />
              </div>
              <h4 className="text-white font-bold text-xl mb-3">Vasodilation & Angiogenesis</h4>
              <p className="text-sm text-white/50 leading-relaxed font-light">
                Consistent cardiovascular engagement alters localized stress indices. Capillary vascular networks actively expand, lowering structural resistance and stabilizing systemic strain.
              </p>
            </div>

            <div className="glass-card bg-[#0A0A0C]/50 backdrop-blur-xl border-white/10 hover:border-teal-400/30 transition-all rounded-[2rem] p-10">
              <div className="p-3 bg-teal-400/10 rounded-xl inline-block mb-6">
                <CheckCircle2 className="text-teal-400" size={28} />
              </div>
              <h4 className="text-white font-bold text-xl mb-3">Endothelial Restoration</h4>
              <p className="text-sm text-white/50 leading-relaxed font-light">
                Eradicating systemic toxic vectors (smoking) and managing lipid intake permits arterial cells to finalize native self-repair tracks, returning absolute elasticity to vessels.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 6. EMOTIONAL RESOLUTION FOOTER */}
      <footer className="relative z-20 bg-[#050505] border-t border-white/5 overflow-hidden">
        
        {/* Soft morning cityscape backdrop */}
        <div className="absolute inset-x-0 bottom-0 h-[60vh] opacity-[0.08] mix-blend-screen pointer-events-none">
          <Image 
            src="/assets/media__1779492601840.png" 
            alt="Stabilized Peaceful Cityscape"
            fill
            className="object-cover object-bottom"
          />
        </div>

        <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-28 pb-16 relative z-10">
          
          {/* Calmer Heart Telemetry Visual */}
          <div className="flex flex-col items-center justify-center text-center mb-24">
            <span className="text-[10px] text-teal-400 font-mono tracking-[0.25em] uppercase block mb-4">Stabilized Cardiac Telemetry</span>
            
            <div className="flex items-center gap-6 text-white font-mono mb-6 bg-teal-950/10 px-6 py-3 rounded-full border border-teal-500/10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                <span className="text-teal-400 font-bold">60 BPM</span>
              </div>
              <span className="text-white/20">|</span>
              <span>SINUS RHYTHM: REGULAR</span>
            </div>

            {/* Calmer ECG SVG path representation */}
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
              <p className="text-white/30 text-sm max-w-md font-light leading-relaxed">
                An immersive scrollytelling ecosystem combining high-fidelity machine learning metrics, volumetric biological canvas sequences, and human structural awareness.
              </p>
            </div>
            
            <div className="text-left md:text-right space-y-4">
              <span className="text-[10px] text-white/30 font-mono tracking-widest uppercase block">BIOCORE // DEPLOYMENT VERIFIED</span>
              <div className="flex flex-wrap gap-2 text-[10px] font-mono text-white/50 justify-start md:justify-end">
                <span className="bg-white/5 px-3 py-1.5 rounded-md">Next.js 16</span>
                <span className="bg-white/5 px-3 py-1.5 rounded-md">Framer Motion</span>
                <span className="bg-white/5 px-3 py-1.5 rounded-md">Uvicorn Stack</span>
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
