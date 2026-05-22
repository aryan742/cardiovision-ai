"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, AnimatePresence } from "framer-motion";
import axios from "axios";
import ThematicHeart from "@/components/ThematicHeart";
import { Activity, HeartPulse, Dna, FileWarning, ShieldCheck, ChevronDown, CheckCircle2, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // States
  const [formData, setFormData] = useState({
    age: 58,
    gender: 1,
    height: 170,
    weight: 85,
    ap_hi: 145,
    ap_lo: 92,
    cholesterol: 3,
    gluc: 1,
    smoke: 1,
    alco: 0,
    active: 1
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
    "Analyzing cardiovascular biomarkers...",
    "Evaluating vascular health patterns...",
    "Assessing endothelial stress factors...",
    "Generating predictive cardiovascular profile..."
  ];

  const handlePredict = async () => {
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    setAnalysisStep(0);
    
    const interval = setInterval(() => {
      setAnalysisStep(prev => Math.min(prev + 1, loadingMessages.length - 1));
    }, 800);
    
    const payload = { ...formData, age: formData.age * 365.25 };
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 3200));
      const response = await axios.post("http://localhost:8000/api/predict", payload);
      setResult(response.data);
      setAnalysisComplete(true);
      
      setTimeout(() => {
        window.scrollBy({ top: window.innerHeight * 0.9, behavior: "smooth" });
      }, 400);
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

  // Cinematic scroll reveals
  const fadeUpVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" as const } }
  };
  
  const fadeVariant = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1.5, ease: "easeInOut" as const } }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-dark-900 text-slate-300">
      <ThematicHeart 
        scrollProgress={scrollProgress} 
        isAnalyzing={isAnalyzing} 
        isHighRisk={isHighRisk} 
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        
        {/* 1. HERO SECTION */}
        <section className="min-h-[100vh] flex flex-col justify-center pt-20">
          <motion.div
            initial="hidden" animate="visible" variants={fadeUpVariant}
            className="max-w-2xl relative z-20"
          >
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
              <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse" />
              <span className="text-slate-300 text-xs font-semibold tracking-widest uppercase">Cardiovascular Intelligence</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-white leading-[1.1]">
              Predictive Health <br/>
              <span className="text-slate-400">Architecture.</span>
            </h1>
            
            <p className="text-lg text-slate-400 leading-relaxed mb-12 max-w-lg">
              An immersive clinical intelligence platform. We translate complex physiological biomarkers into predictive cardiovascular insights using robust, production-grade analytics.
            </p>
            
            <button 
              onClick={() => window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' })}
              className="group flex items-center gap-4 bg-white text-dark-900 font-semibold rounded-full px-8 py-4 transition-all hover:bg-slate-200"
            >
              Begin Assessment
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
          
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-600"
          >
            <ChevronDown size={32} />
          </motion.div>
        </section>

        {/* 2. INTRODUCTION STORYTELLING */}
        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-20%" }} variants={fadeVariant}
          className="min-h-[60vh] flex items-center py-20"
        >
          <div className="max-w-3xl ml-auto text-right">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white leading-tight">
              Beyond the Black Box
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              Modern medicine requires transparency. By integrating predictive modeling with an immersive, step-by-step diagnostic journey, CardioVision AI reveals the physiological narrative driving cardiovascular deterioration—before it becomes critical.
            </p>
          </div>
        </motion.section>

        {/* 3. INTERACTIVE INPUT SECTION */}
        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-10%" }} variants={fadeUpVariant}
          className="min-h-[90vh] flex flex-col justify-center py-20"
        >
          <div className="mb-12 max-w-2xl">
            <h2 className="text-3xl font-bold text-white mb-3">Clinical Profile Configuration</h2>
            <p className="text-slate-400 text-lg">Define current patient biomarkers to generate a predictive diagnostic vector.</p>
          </div>

          <div className="glass-card bg-dark-800/60 shadow-2xl relative overflow-hidden">
            {/* Subtle background glow in card */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-400/5 rounded-full blur-3xl -z-10" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12">
              
              {/* Vital Signs */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-white/10 pb-3 mb-6">
                  <Activity size={18} className="text-teal-400" />
                  <h3 className="text-white font-semibold tracking-wide">Demographics & Vitals</h3>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs text-slate-400 uppercase tracking-wider font-medium">Chronological Age</label>
                    <span className="text-sm text-white">{formData.age} yrs</span>
                  </div>
                  <input type="range" min="18" max="100" value={formData.age} onChange={e => setFormData({...formData, age: +e.target.value})} className="w-full accent-teal-400" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 uppercase tracking-wider font-medium mb-2">Biological Sex</label>
                    <select value={formData.gender} onChange={e => setFormData({...formData, gender: +e.target.value})} className="glass-select py-2 text-sm">
                      <option value={1}>Female</option>
                      <option value={2}>Male</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 uppercase tracking-wider font-medium mb-2">Weight (kg)</label>
                    <input type="number" value={formData.weight} onChange={e => setFormData({...formData, weight: +e.target.value})} className="glass-input py-2 text-sm" />
                  </div>
                </div>
              </div>

              {/* Hemodynamics */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-white/10 pb-3 mb-6">
                  <HeartPulse size={18} className="text-coral-500" />
                  <h3 className="text-white font-semibold tracking-wide">Hemodynamics</h3>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs text-slate-400 uppercase tracking-wider font-medium">Systolic Pressure</label>
                    <span className="text-sm text-white">{formData.ap_hi} mmHg</span>
                  </div>
                  <input type="range" min="90" max="200" value={formData.ap_hi} onChange={e => setFormData({...formData, ap_hi: +e.target.value})} className="w-full accent-coral-500" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs text-slate-400 uppercase tracking-wider font-medium">Diastolic Pressure</label>
                    <span className="text-sm text-white">{formData.ap_lo} mmHg</span>
                  </div>
                  <input type="range" min="60" max="130" value={formData.ap_lo} onChange={e => setFormData({...formData, ap_lo: +e.target.value})} className="w-full accent-coral-500" />
                </div>
              </div>

              {/* Lab & Lifestyle */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-white/10 pb-3 mb-6">
                  <Dna size={18} className="text-teal-400" />
                  <h3 className="text-white font-semibold tracking-wide">Labs & Lifestyle</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 uppercase tracking-wider font-medium mb-2">Lipid Profile</label>
                    <select value={formData.cholesterol} onChange={e => setFormData({...formData, cholesterol: +e.target.value})} className="glass-select py-2 text-sm">
                      <option value={1}>Normal</option>
                      <option value={2}>Borderline</option>
                      <option value={3}>High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 uppercase tracking-wider font-medium mb-2">Glucose</label>
                    <select value={formData.gluc} onChange={e => setFormData({...formData, gluc: +e.target.value})} className="glass-select py-2 text-sm">
                      <option value={1}>Normal</option>
                      <option value={2}>Elevated</option>
                      <option value={3}>Diabetic</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 uppercase tracking-wider font-medium mb-2">Tobacco Use</label>
                    <select value={formData.smoke} onChange={e => setFormData({...formData, smoke: +e.target.value})} className="glass-select py-2 text-sm">
                      <option value={0}>No</option>
                      <option value={1}>Active</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 uppercase tracking-wider font-medium mb-2">Activity Level</label>
                    <select value={formData.active} onChange={e => setFormData({...formData, active: +e.target.value})} className="glass-select py-2 text-sm">
                      <option value={1}>Active</option>
                      <option value={0}>Sedentary</option>
                    </select>
                  </div>
                </div>
              </div>

            </div>

            <div className="mt-14 flex flex-col items-center border-t border-white/5 pt-10">
              <AnimatePresence mode="wait">
                {isAnalyzing ? (
                  <motion.div 
                    key="analyzing"
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    className="flex flex-col items-center"
                  >
                    <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-white font-medium tracking-wide">{loadingMessages[analysisStep]}</p>
                  </motion.div>
                ) : (
                  <motion.button 
                    key="button"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    onClick={handlePredict}
                    className="bg-white hover:bg-slate-200 text-dark-900 font-bold rounded-full px-10 py-4 transition-all shadow-xl"
                  >
                    Generate Diagnostic Vector
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.section>

        {/* 4. RESULTS & STORYTELLING FLOW */}
        <AnimatePresence>
          {analysisComplete && result && (
            <motion.div
              initial="hidden" animate="visible" variants={fadeUpVariant}
            >
              {/* RESULTS DASHBOARD */}
              <section className="min-h-[90vh] flex flex-col justify-center py-20">
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-white mb-2">Assessment Results</h2>
                  <p className="text-slate-400 text-lg">Predictive inference generated from current health metrics.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Clinical Summary */}
                  <div className="glass-card bg-dark-800/80 flex flex-col justify-between">
                    <div>
                      <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">Diagnostic Classification</h3>
                      {isHighRisk ? (
                        <div className="mb-4">
                          <div className="inline-flex items-center gap-2 text-coral-500 mb-3">
                            <FileWarning size={22} />
                            <span className="font-bold text-xl">Elevated Risk Flagged</span>
                          </div>
                          <p className="text-slate-300 text-sm leading-relaxed">
                            The current biometric profile indicates severe compounding factors associated with increased cardiovascular pathology. Preventative clinical measures should be prioritized.
                          </p>
                        </div>
                      ) : (
                        <div className="mb-4">
                          <div className="inline-flex items-center gap-2 text-teal-400 mb-3">
                            <CheckCircle2 size={22} />
                            <span className="font-bold text-xl">Physiological Normal</span>
                          </div>
                          <p className="text-slate-300 text-sm leading-relaxed">
                            The metrics provided fall within generally healthy parameters. Maintaining current active lifestyle habits is recommended.
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-6 border-t border-white/5 mt-8">
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Model Reliability Benchmark</p>
                      <p className="text-white text-sm font-medium">{confidence}% prediction confidence</p>
                    </div>
                  </div>

                  {/* Risk Gauge */}
                  <div className="glass-card bg-dark-800/80 flex flex-col justify-center items-center py-16">
                    <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-10">Systemic Risk Coefficient</h3>
                    
                    <div className="relative h-44 flex items-end justify-center overflow-hidden w-full max-w-[300px]">
                      <div className="absolute top-0 w-full h-[300px] rounded-full border-[10px] border-white/5 border-b-transparent border-l-transparent -rotate-45" />
                      
                      <motion.div 
                        initial={{ rotate: -45 }}
                        animate={{ rotate: -45 + (result.risk_probability / 100) * 180 }}
                        transition={{ duration: 1.8, ease: "easeOut", delay: 0.2 }}
                        className={`absolute top-0 w-full h-[300px] rounded-full border-[10px] border-b-transparent border-l-transparent -rotate-45 ${isHighRisk ? 'border-coral-500' : 'border-teal-400'}`}
                        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)', filter: `drop-shadow(0 0 10px ${isHighRisk ? 'rgba(230,57,70,0.5)' : 'rgba(0,242,254,0.5)'})` }}
                      />
                      
                      <div className="absolute bottom-0 text-center pb-2">
                        <span className="text-6xl font-bold text-white tracking-tight">{riskProb}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Key Observations */}
                  <div className="glass-card bg-dark-800/80">
                    <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-8">Pathological Drivers</h3>
                    
                    <div className="space-y-6">
                      {formData.ap_hi >= 130 ? (
                        <div className="flex gap-4">
                          <div className="w-1.5 h-1.5 rounded-full bg-coral-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(230,57,70,0.8)]" />
                          <div>
                            <p className="text-white text-sm font-semibold mb-1">Hypertensive Strain</p>
                            <p className="text-slate-400 text-sm leading-relaxed">Elevated arterial pressure exerts severe mechanical stress on vascular walls.</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-4">
                          <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-2 shrink-0 shadow-[0_0_8px_rgba(0,242,254,0.8)]" />
                          <div>
                            <p className="text-white text-sm font-semibold mb-1">Stable Blood Pressure</p>
                            <p className="text-slate-400 text-sm leading-relaxed">Within a healthy baseline range, minimizing arterial workload.</p>
                          </div>
                        </div>
                      )}

                      {formData.cholesterol > 1 && (
                        <div className="flex gap-4">
                          <div className="w-1.5 h-1.5 rounded-full bg-coral-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(230,57,70,0.8)]" />
                          <div>
                            <p className="text-white text-sm font-semibold mb-1">Lipid Accumulation</p>
                            <p className="text-slate-400 text-sm leading-relaxed">Elevated serum cholesterol grades accelerate atherosclerotic plaque deposition.</p>
                          </div>
                        </div>
                      )}
                      
                      {formData.smoke === 1 && (
                        <div className="flex gap-4">
                          <div className="w-1.5 h-1.5 rounded-full bg-coral-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(230,57,70,0.8)]" />
                          <div>
                            <p className="text-white text-sm font-semibold mb-1">Endothelial Toxicity</p>
                            <p className="text-slate-400 text-sm leading-relaxed">Active tobacco use induces systemic inflammation and vasoconstriction.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* 5. EDUCATIONAL STORYTELLING: WHY IT HAPPENS */}
              <section className="py-32 border-t border-white/5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-6">The Anatomy of Risk</h2>
                    <p className="text-slate-400 text-lg leading-relaxed mb-6">
                      Cardiovascular disease is rarely sudden. It is a progressive structural breakdown of the vascular network, primarily driven by lifestyle and metabolic factors.
                    </p>
                    <p className="text-slate-400 text-lg leading-relaxed mb-8">
                      When high blood pressure combines with elevated cholesterol, micro-tears in the arterial lining allow lipid plaques to calcify. Over time, this narrowing (atherosclerosis) severely restricts oxygen delivery to myocardial tissues.
                    </p>
                  </div>
                  <div className="relative h-[300px] w-full rounded-3xl overflow-hidden glass-card p-0">
                    <Image 
                      src="/assets/narrowing_of_coronary_artery.png" 
                      alt="Atherosclerosis Progression"
                      fill
                      className="object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent" />
                  </div>
                </div>
              </section>

              {/* 6. PREVENTION & RECOVERY STORYTELLING */}
              <section className="relative py-40 -mx-6 px-6 overflow-hidden">
                {/* Runner & Health Environment Layer */}
                <div className="absolute inset-0 z-0">
                  <Image 
                    src="/assets/media__1779492571042.jpg" 
                    alt="Recovery Runner Atmosphere"
                    fill
                    className="object-cover opacity-15"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-900/80 to-dark-900" />
                </div>
                
                <div className="relative z-10 max-w-4xl mx-auto text-center">
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">The Path to Recovery</h2>
                  <p className="text-xl text-slate-300 leading-relaxed mb-16">
                    Physiology is highly adaptable. Targeted lifestyle architecture can halt and even reverse vascular deterioration.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                    <div className="glass-card bg-dark-800/40 backdrop-blur-md">
                      <ShieldCheck className="text-teal-400 mb-4" size={28} />
                      <h4 className="text-white font-bold mb-3">Vasodilation Protocols</h4>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        Engaging in 150+ minutes of consistent cardiovascular training weekly fundamentally alters vascular resistance, expanding capillary networks and reducing resting systemic pressure.
                      </p>
                    </div>
                    
                    <div className="glass-card bg-dark-800/40 backdrop-blur-md">
                      <Activity className="text-teal-400 mb-4" size={28} />
                      <h4 className="text-white font-bold mb-3">Endothelial Rehabilitation</h4>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        Removing toxic inflammatory vectors (such as tobacco) and managing saturated lipid intake allows arterial walls to engage their natural self-repair cycles, restoring flexibility to the vascular network.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

            </motion.div>
          )}
        </AnimatePresence>

        {/* 7. CINEMATIC FOOTER */}
        <footer className="py-16 border-t border-white/5 mt-20 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div>
              <h4 className="text-white font-bold mb-2">CardioVision AI</h4>
              <p className="text-slate-500 text-sm max-w-xs">An immersive, scrollytelling intelligence platform blending robust ML pipelines with premium environmental web design.</p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-slate-500 text-xs uppercase tracking-widest mb-2">Architecture</p>
              <p className="text-slate-400 text-sm">Next.js • Tailwind • Framer Motion • FastAPI • XGBoost</p>
            </div>
          </div>
        </footer>

      </div>
    </main>
  );
}
