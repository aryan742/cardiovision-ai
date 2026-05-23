"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, AnimatePresence } from "framer-motion";
import axios from "axios";
import ThematicHeart from "@/components/ThematicHeart";
import BackgroundEnvironment from "@/components/BackgroundEnvironment";
import { Activity, HeartPulse, Dna, FileWarning, ShieldCheck, ChevronDown, CheckCircle2, ArrowRight, ScanLine, Microchip } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // States
  const [formData, setFormData] = useState({
    age: 58, gender: 1, height: 170, weight: 85, ap_hi: 145,
    ap_lo: 92, cholesterol: 3, gluc: 1, smoke: 1, alco: 0, active: 1
  });
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  useEffect(() => {
    return scrollYProgress.onChange((latest) => {
      setScrollProgress(latest);
    });
  }, [scrollYProgress]);

  const loadingMessages = [
    "Establishing neural link to medical vector...",
    "Analyzing cardiovascular biomarkers...",
    "Evaluating vascular health patterns...",
    "Assessing endothelial stress factors...",
    "Generating predictive clinical profile..."
  ];

  const handlePredict = async () => {
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    setAnalysisStep(0);
    
    const interval = setInterval(() => {
      setAnalysisStep(prev => Math.min(prev + 1, loadingMessages.length - 1));
    }, 700);
    
    const payload = { ...formData, age: formData.age * 365.25 };
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 3800));
      const response = await axios.post("http://localhost:8000/api/predict", payload);
      setResult(response.data);
      setAnalysisComplete(true);
      
      setTimeout(() => {
        window.scrollBy({ top: window.innerHeight * 1.1, behavior: "smooth" });
      }, 500);
    } catch (error) {
      console.error("Prediction failed:", error);
    } finally {
      clearInterval(interval);
      setIsAnalyzing(false);
    }
  };

  const isHighRisk = result?.risk_level === "High Risk";
  const confidence = result ? (result.confidence > 99 ? 99.1 : result.confidence).toFixed(1) : 0;
  const riskProb = result ? result.risk_probability.toFixed(1) : 0;

  // Staggered cinematic reveals
  const fadeUpVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: "easeOut" as const } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  return (
    <main className="relative min-h-screen bg-transparent text-slate-300 font-sans selection:bg-teal-500/30 selection:text-white">
      {/* 0. Environmental Foundations */}
      <BackgroundEnvironment />
      <ThematicHeart scrollProgress={scrollProgress} isAnalyzing={isAnalyzing} isHighRisk={isHighRisk} />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12">
        
        {/* 1. HERO SECTION */}
        <section className="relative min-h-[110vh] flex flex-col justify-center pt-24 pb-12">
          
          {/* Decorative Technical Overlays */}
          <div className="absolute top-10 right-10 flex items-center gap-2 text-teal-400/50 font-mono text-[10px] uppercase tracking-widest hidden md:flex">
            <ScanLine size={12} />
            <span>Telemetry Online</span>
          </div>
          
          <motion.div initial="hidden" animate="visible" variants={fadeUpVariant} className="max-w-3xl relative z-20">
            <div className="inline-flex items-center gap-3 bg-teal-900/20 border border-teal-400/30 rounded-full px-5 py-2 mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(0,242,254,0.1)]">
              <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(0,242,254,0.8)]" />
              <span className="text-teal-400 text-xs font-bold tracking-widest uppercase">Cardiovascular Intelligence</span>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 text-white leading-[1.05] drop-shadow-2xl">
              Predictive <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-blue-400 to-slate-400">
                Health Architecture.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-12 max-w-xl font-light">
              An immersive clinical intelligence platform. We translate complex physiological biomarkers into predictive cardiovascular insights using robust, production-grade analytics.
            </p>
            
            <button 
              onClick={() => window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' })}
              className="group relative flex items-center gap-4 bg-white/10 border border-white/20 backdrop-blur-xl hover:bg-white text-white hover:text-dark-900 font-bold rounded-full px-10 py-5 transition-all shadow-[0_0_40px_rgba(255,255,255,0.05)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-teal-400/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10">Initiate Assessment</span>
              <ArrowRight size={20} className="relative z-10 group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.div>
          
          <motion.div animate={{ y: [0, 15, 0], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 3 }} className="absolute bottom-16 left-1/2 -translate-x-1/2 text-teal-400/50">
            <ChevronDown size={40} strokeWidth={1} />
          </motion.div>
        </section>

        {/* 2. INTRODUCTION STORYTELLING (Overlapped) */}
        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-10%" }} variants={fadeUpVariant}
          className="relative min-h-[50vh] flex items-center py-32 -mt-20 z-20"
        >
          {/* Ambient Glow behind text */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="max-w-3xl ml-auto text-right">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white leading-tight">
              Beyond the <span className="text-teal-400 font-light italic">Black Box</span>
            </h2>
            <p className="text-xl text-slate-300 leading-relaxed font-light">
              Modern medicine requires transparency. By integrating predictive modeling with an immersive diagnostic journey, CardioVision AI reveals the physiological narrative driving cardiovascular deterioration—before it becomes critical.
            </p>
          </div>
        </motion.section>

        {/* 3. INTERACTIVE INPUT SECTION */}
        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-5%" }} variants={staggerContainer}
          className="relative min-h-[90vh] flex flex-col justify-center py-20 z-30"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[150%] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.4)_0%,transparent_80%)] pointer-events-none -z-10" />

          <motion.div variants={fadeUpVariant} className="mb-16 max-w-3xl">
            <div className="flex items-center gap-3 mb-4 text-teal-400">
              <Microchip size={24} />
              <span className="uppercase tracking-widest text-sm font-bold">Data Vectoring</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Clinical Profile Configuration</h2>
            <p className="text-slate-400 text-xl font-light">Define current patient biomarkers to generate a predictive diagnostic vector.</p>
          </motion.div>

          <motion.div variants={fadeUpVariant} className="glass-card bg-dark-800/50 backdrop-blur-3xl shadow-[0_30px_100px_rgba(0,0,0,0.5)] border-white/10 relative overflow-hidden rounded-[2rem] p-10 md:p-14">
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-16 relative z-10">
              {/* Vital Signs */}
              <div className="space-y-8">
                <div className="flex items-center gap-4 border-b border-white/10 pb-4 mb-8">
                  <div className="p-2 bg-teal-400/10 rounded-lg text-teal-400"><Activity size={20} /></div>
                  <h3 className="text-white font-bold tracking-wide text-lg">Demographics & Vitals</h3>
                </div>
                <div className="group">
                  <div className="flex justify-between mb-3">
                    <label className="text-xs text-slate-400 uppercase tracking-widest font-bold">Chronological Age</label>
                    <span className="text-sm text-teal-300 font-mono">{formData.age} yrs</span>
                  </div>
                  <input type="range" min="18" max="100" value={formData.age} onChange={e => setFormData({...formData, age: +e.target.value})} className="w-full accent-teal-400" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs text-slate-400 uppercase tracking-widest font-bold mb-3">Biological Sex</label>
                    <select value={formData.gender} onChange={e => setFormData({...formData, gender: +e.target.value})} className="glass-select py-3 text-sm bg-black/40">
                      <option value={1}>Female</option>
                      <option value={2}>Male</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 uppercase tracking-widest font-bold mb-3">Weight (kg)</label>
                    <input type="number" value={formData.weight} onChange={e => setFormData({...formData, weight: +e.target.value})} className="glass-input py-3 text-sm bg-black/40" />
                  </div>
                </div>
              </div>

              {/* Hemodynamics */}
              <div className="space-y-8">
                <div className="flex items-center gap-4 border-b border-white/10 pb-4 mb-8">
                  <div className="p-2 bg-coral-500/10 rounded-lg text-coral-500"><HeartPulse size={20} /></div>
                  <h3 className="text-white font-bold tracking-wide text-lg">Hemodynamics</h3>
                </div>
                <div>
                  <div className="flex justify-between mb-3">
                    <label className="text-xs text-slate-400 uppercase tracking-widest font-bold">Systolic Pressure</label>
                    <span className="text-sm text-coral-400 font-mono">{formData.ap_hi} mmHg</span>
                  </div>
                  <input type="range" min="90" max="200" value={formData.ap_hi} onChange={e => setFormData({...formData, ap_hi: +e.target.value})} className="w-full accent-coral-500" />
                </div>
                <div>
                  <div className="flex justify-between mb-3">
                    <label className="text-xs text-slate-400 uppercase tracking-widest font-bold">Diastolic Pressure</label>
                    <span className="text-sm text-coral-400 font-mono">{formData.ap_lo} mmHg</span>
                  </div>
                  <input type="range" min="60" max="130" value={formData.ap_lo} onChange={e => setFormData({...formData, ap_lo: +e.target.value})} className="w-full accent-coral-500" />
                </div>
              </div>

              {/* Lab & Lifestyle */}
              <div className="space-y-8">
                <div className="flex items-center gap-4 border-b border-white/10 pb-4 mb-8">
                  <div className="p-2 bg-blue-400/10 rounded-lg text-blue-400"><Dna size={20} /></div>
                  <h3 className="text-white font-bold tracking-wide text-lg">Labs & Lifestyle</h3>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs text-slate-400 uppercase tracking-widest font-bold mb-3">Lipid Profile</label>
                    <select value={formData.cholesterol} onChange={e => setFormData({...formData, cholesterol: +e.target.value})} className="glass-select py-3 text-sm bg-black/40">
                      <option value={1}>Normal</option>
                      <option value={2}>Borderline</option>
                      <option value={3}>High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 uppercase tracking-widest font-bold mb-3">Glucose</label>
                    <select value={formData.gluc} onChange={e => setFormData({...formData, gluc: +e.target.value})} className="glass-select py-3 text-sm bg-black/40">
                      <option value={1}>Normal</option>
                      <option value={2}>Elevated</option>
                      <option value={3}>Diabetic</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs text-slate-400 uppercase tracking-widest font-bold mb-3">Tobacco Use</label>
                    <select value={formData.smoke} onChange={e => setFormData({...formData, smoke: +e.target.value})} className="glass-select py-3 text-sm bg-black/40">
                      <option value={0}>No</option>
                      <option value={1}>Active</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 uppercase tracking-widest font-bold mb-3">Activity Level</label>
                    <select value={formData.active} onChange={e => setFormData({...formData, active: +e.target.value})} className="glass-select py-3 text-sm bg-black/40">
                      <option value={1}>Active</option>
                      <option value={0}>Sedentary</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Analysis Button Area */}
            <div className="mt-20 flex flex-col items-center relative z-10">
              <AnimatePresence mode="wait">
                {isAnalyzing ? (
                  <motion.div 
                    key="analyzing"
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    className="flex flex-col items-center bg-black/40 backdrop-blur-xl border border-teal-400/30 rounded-3xl p-8 min-w-[350px] shadow-[0_0_50px_rgba(0,242,254,0.15)]"
                  >
                    <div className="relative flex items-center justify-center mb-6">
                      <div className="w-12 h-12 border-2 border-teal-400/20 border-t-teal-400 rounded-full animate-spin" />
                      <Activity size={16} className="absolute text-teal-400 animate-pulse" />
                    </div>
                    <p className="text-teal-300 font-mono text-sm tracking-wide text-center h-5">{loadingMessages[analysisStep]}</p>
                  </motion.div>
                ) : (
                  <motion.button 
                    key="button"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    onClick={handlePredict}
                    className="group flex items-center gap-3 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-white font-bold rounded-full px-12 py-5 transition-all shadow-[0_10px_40px_rgba(0,242,254,0.3)] hover:shadow-[0_15px_60px_rgba(0,242,254,0.5)] hover:-translate-y-1"
                  >
                    <ScanLine size={20} />
                    Generate Diagnostic Vector
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.section>

        {/* 4. RESULTS & PATHOLOGY INTEGRATION */}
        <AnimatePresence>
          {analysisComplete && result && (
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="relative z-40">
              
              {/* RESULTS DASHBOARD */}
              <motion.section variants={fadeUpVariant} className="min-h-[85vh] flex flex-col justify-center py-24">
                <div className="mb-16">
                  <h2 className="text-4xl font-bold text-white mb-4">Assessment Results</h2>
                  <p className="text-slate-400 text-xl font-light">Predictive inference generated from multi-variable XGBoost matrices.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Clinical Summary */}
                  <div className="glass-card bg-dark-800/70 backdrop-blur-2xl flex flex-col justify-between border-white/10 rounded-[2rem] p-10">
                    <div>
                      <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-8 flex items-center gap-2"><ScanLine size={14}/> Diagnostic Classification</h3>
                      {isHighRisk ? (
                        <div className="mb-4">
                          <div className="inline-flex items-center gap-3 text-coral-500 mb-4 bg-coral-500/10 px-4 py-2 rounded-lg border border-coral-500/20">
                            <FileWarning size={24} />
                            <span className="font-bold text-xl">Elevated Risk Flagged</span>
                          </div>
                          <p className="text-slate-300 text-base leading-relaxed font-light">
                            The current biometric profile indicates severe compounding factors associated with increased cardiovascular pathology. Preventative clinical measures should be prioritized.
                          </p>
                        </div>
                      ) : (
                        <div className="mb-4">
                          <div className="inline-flex items-center gap-3 text-teal-400 mb-4 bg-teal-400/10 px-4 py-2 rounded-lg border border-teal-400/20">
                            <CheckCircle2 size={24} />
                            <span className="font-bold text-xl">Physiological Normal</span>
                          </div>
                          <p className="text-slate-300 text-base leading-relaxed font-light">
                            The metrics provided fall within generally healthy parameters. Maintaining current active lifestyle habits is recommended.
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-6 border-t border-white/10 mt-10">
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-bold">Model Reliability Benchmark</p>
                      <p className="text-white text-lg font-mono">{confidence}% prediction confidence</p>
                    </div>
                  </div>

                  {/* Risk Gauge */}
                  <div className="glass-card bg-dark-800/70 backdrop-blur-2xl flex flex-col justify-center items-center py-16 border-white/10 rounded-[2rem]">
                    <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-12 flex items-center gap-2"><Activity size={14}/> Systemic Risk Coefficient</h3>
                    
                    <div className="relative h-56 flex items-end justify-center overflow-hidden w-full max-w-[340px]">
                      {/* Background Track */}
                      <div className="absolute top-0 w-full h-[340px] rounded-full border-[14px] border-white/5 border-b-transparent border-l-transparent -rotate-45" />
                      
                      {/* Animated Fill */}
                      <motion.div 
                        initial={{ rotate: -45 }}
                        animate={{ rotate: -45 + (result.risk_probability / 100) * 180 }}
                        transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                        className={`absolute top-0 w-full h-[340px] rounded-full border-[14px] border-b-transparent border-l-transparent -rotate-45 ${isHighRisk ? 'border-coral-500' : 'border-teal-400'}`}
                        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)', filter: `drop-shadow(0 0 20px ${isHighRisk ? 'rgba(230,57,70,0.5)' : 'rgba(0,242,254,0.5)'})` }}
                      />
                      
                      <div className="absolute bottom-0 text-center pb-2 flex flex-col items-center">
                        <span className="text-7xl font-black text-white tracking-tighter drop-shadow-lg">{riskProb}%</span>
                        <span className="text-xs text-slate-500 uppercase tracking-widest mt-2">Probability</span>
                      </div>
                    </div>
                  </div>

                  {/* Key Observations */}
                  <div className="glass-card bg-dark-800/70 backdrop-blur-2xl border-white/10 rounded-[2rem] p-10">
                    <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-8 flex items-center gap-2"><Dna size={14}/> Pathological Drivers</h3>
                    
                    <div className="space-y-8">
                      {formData.ap_hi >= 130 ? (
                        <div className="flex gap-5 group">
                          <div className="w-2 h-2 rounded-full bg-coral-500 mt-2 shrink-0 shadow-[0_0_12px_rgba(230,57,70,0.9)] group-hover:scale-150 transition-transform" />
                          <div>
                            <p className="text-white text-base font-bold mb-1">Hypertensive Strain</p>
                            <p className="text-slate-400 text-sm leading-relaxed font-light">Elevated arterial pressure exerts severe mechanical stress on vascular walls.</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-5 group">
                          <div className="w-2 h-2 rounded-full bg-teal-400 mt-2 shrink-0 shadow-[0_0_12px_rgba(0,242,254,0.9)] group-hover:scale-150 transition-transform" />
                          <div>
                            <p className="text-white text-base font-bold mb-1">Stable Blood Pressure</p>
                            <p className="text-slate-400 text-sm leading-relaxed font-light">Within a healthy baseline range, minimizing arterial workload.</p>
                          </div>
                        </div>
                      )}

                      {formData.cholesterol > 1 && (
                        <div className="flex gap-5 group">
                          <div className="w-2 h-2 rounded-full bg-coral-500 mt-2 shrink-0 shadow-[0_0_12px_rgba(230,57,70,0.9)] group-hover:scale-150 transition-transform" />
                          <div>
                            <p className="text-white text-base font-bold mb-1">Lipid Accumulation</p>
                            <p className="text-slate-400 text-sm leading-relaxed font-light">Elevated serum cholesterol grades accelerate atherosclerotic plaque deposition.</p>
                          </div>
                        </div>
                      )}
                      
                      {formData.smoke === 1 && (
                        <div className="flex gap-5 group">
                          <div className="w-2 h-2 rounded-full bg-coral-500 mt-2 shrink-0 shadow-[0_0_12px_rgba(230,57,70,0.9)] group-hover:scale-150 transition-transform" />
                          <div>
                            <p className="text-white text-base font-bold mb-1">Endothelial Toxicity</p>
                            <p className="text-slate-400 text-sm leading-relaxed font-light">Active tobacco use induces systemic inflammation and vasoconstriction.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* 5. EDUCATIONAL STORYTELLING: WHY IT HAPPENS (Overlapped) */}
              <motion.section variants={fadeUpVariant} className="relative py-40 border-t border-white/5 -mx-6 px-6 md:-mx-12 md:px-12 bg-gradient-to-b from-transparent via-dark-900/50 to-dark-900 mt-10">
                <div className="absolute inset-0 bg-[url('/assets/media__1779492122478.png')] bg-fixed opacity-[0.03] bg-center bg-no-repeat bg-cover mix-blend-screen pointer-events-none" />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center max-w-[1400px] mx-auto">
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-3 mb-6 text-slate-400">
                      <Activity size={18} />
                      <span className="uppercase tracking-widest text-xs font-bold">Pathology Deep Dive</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">The Anatomy of Risk</h2>
                    <p className="text-slate-300 text-xl leading-relaxed mb-6 font-light">
                      Cardiovascular disease is rarely sudden. It is a progressive structural breakdown of the vascular network, primarily driven by lifestyle and metabolic factors.
                    </p>
                    <p className="text-slate-400 text-lg leading-relaxed mb-8 font-light">
                      When high blood pressure combines with elevated cholesterol, micro-tears in the arterial lining allow lipid plaques to calcify. Over time, this narrowing (atherosclerosis) severely restricts oxygen delivery to myocardial tissues.
                    </p>
                  </div>
                  <div className="relative h-[400px] w-full rounded-[2rem] overflow-hidden glass-card p-0 border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group">
                    <Image 
                      src="/assets/narrowing_of_coronary_artery.png" 
                      alt="Atherosclerosis Progression"
                      fill
                      className="object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent" />
                    
                    {/* Diagnostic Overlay */}
                    <div className="absolute bottom-6 left-6 flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
                      <div className="w-2 h-2 rounded-full bg-coral-500 animate-ping" />
                      <span className="text-xs text-white font-mono uppercase tracking-widest">Arterial Plaque Visualization</span>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* 6. PREVENTION & RECOVERY STORYTELLING */}
              <motion.section variants={fadeUpVariant} className="relative py-48 -mx-6 px-6 md:-mx-12 md:px-12 overflow-hidden bg-dark-900">
                {/* Runner & Health Environment Layer */}
                <div className="absolute inset-0 z-0">
                  <Image 
                    src="/assets/media__1779492571042.jpg" 
                    alt="Recovery Runner Atmosphere"
                    fill
                    className="object-cover opacity-[0.15] mix-blend-screen scale-105 origin-bottom"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-transparent to-dark-900" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(0,242,254,0.1),transparent_70%)]" />
                </div>
                
                <div className="relative z-10 max-w-5xl mx-auto text-center">
                  <div className="inline-flex items-center gap-3 mb-6 text-teal-400">
                    <ShieldCheck size={18} />
                    <span className="uppercase tracking-widest text-xs font-bold">Clinical Action Plan</span>
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">The Path to Recovery</h2>
                  <p className="text-2xl text-slate-300 leading-relaxed mb-20 max-w-3xl mx-auto font-light">
                    Physiology is highly adaptable. Targeted lifestyle architecture can halt and even reverse vascular deterioration.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left">
                    <div className="glass-card bg-dark-800/40 backdrop-blur-2xl border-white/10 hover:border-teal-400/50 transition-colors rounded-[2rem] p-10 shadow-2xl">
                      <div className="p-3 bg-teal-400/10 rounded-xl inline-block mb-6">
                        <Activity className="text-teal-400" size={32} />
                      </div>
                      <h4 className="text-white font-bold text-2xl mb-4">Vasodilation Protocols</h4>
                      <p className="text-base text-slate-400 leading-relaxed font-light">
                        Engaging in 150+ minutes of consistent cardiovascular training weekly fundamentally alters vascular resistance, expanding capillary networks and significantly reducing resting systemic pressure.
                      </p>
                    </div>
                    
                    <div className="glass-card bg-dark-800/40 backdrop-blur-2xl border-white/10 hover:border-teal-400/50 transition-colors rounded-[2rem] p-10 shadow-2xl">
                      <div className="p-3 bg-teal-400/10 rounded-xl inline-block mb-6">
                        <HeartPulse className="text-teal-400" size={32} />
                      </div>
                      <h4 className="text-white font-bold text-2xl mb-4">Endothelial Rehabilitation</h4>
                      <p className="text-base text-slate-400 leading-relaxed font-light">
                        Removing toxic inflammatory vectors (such as tobacco) and managing saturated lipid intake allows arterial walls to engage their natural self-repair cycles, restoring flexibility to the vascular network.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.section>

            </motion.div>
          )}
        </AnimatePresence>

        {/* 7. CINEMATIC FOOTER */}
        <footer className="py-20 border-t border-white/5 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 max-w-[1400px] mx-auto">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 bg-teal-400 rounded-full" />
                <h4 className="text-white font-bold text-xl tracking-wide">CardioVision AI</h4>
              </div>
              <p className="text-slate-500 text-sm max-w-md leading-relaxed font-light">An immersive, scrollytelling intelligence platform blending robust ML pipelines with premium environmental web design.</p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-slate-500 text-xs uppercase tracking-widest mb-3 font-bold">Core Architecture</p>
              <div className="flex flex-wrap gap-2 text-slate-400 text-sm font-mono">
                <span className="bg-white/5 px-3 py-1 rounded-md">Next.js</span>
                <span className="bg-white/5 px-3 py-1 rounded-md">Framer Motion</span>
                <span className="bg-white/5 px-3 py-1 rounded-md">FastAPI</span>
                <span className="bg-white/5 px-3 py-1 rounded-md">XGBoost</span>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </main>
  );
}
