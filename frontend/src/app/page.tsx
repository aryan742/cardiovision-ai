"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, AnimatePresence } from "framer-motion";
import axios from "axios";
import ThematicHeart from "@/components/ThematicHeart";
import { Activity, HeartPulse, Dna, FileWarning, ShieldCheck, ChevronDown, CheckCircle2 } from "lucide-react";
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
    
    // Cycle through messages
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
        window.scrollBy({ top: 600, behavior: "smooth" });
      }, 300);
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

  // Stagger variants for smooth scroll reveals
  const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
  };

  return (
    <main className="relative min-h-screen pb-32 overflow-hidden">
      <ThematicHeart 
        scrollProgress={scrollProgress} 
        isAnalyzing={isAnalyzing} 
        isHighRisk={isHighRisk} 
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        
        {/* 1. HERO SECTION */}
        <section className="min-h-[85vh] flex flex-col justify-center pt-24 pb-12">
          <motion.div
            initial="hidden" animate="visible" variants={fadeUpVariant}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-3 bg-teal-400/5 border border-teal-400/20 rounded-full px-4 py-2 mb-8">
              <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse" />
              <span className="text-teal-400 text-xs font-semibold tracking-wide uppercase">Clinical Assessment Active</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-white leading-tight">
              Cardiovascular Intelligence
            </h1>
            
            <p className="text-lg text-slate-400 leading-relaxed mb-10 max-w-xl">
              An advanced analytical tool designed to assess physiological indicators. We analyze standard health metrics to provide a clearer picture of your cardiovascular health trajectory.
            </p>
            
            <button 
              onClick={() => window.scrollBy({ top: window.innerHeight * 0.7, behavior: 'smooth' })}
              className="bg-white text-dark-900 font-semibold rounded-full px-8 py-3.5 transition-all hover:bg-slate-200"
            >
              Begin Assessment
            </button>
          </motion.div>
        </section>

        {/* 2. INTERACTIVE INPUT SECTION */}
        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUpVariant}
          className="py-16"
        >
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">Patient Profile</h2>
            <p className="text-slate-400">Enter current health metrics for an updated assessment.</p>
          </div>

          <div className="glass-card bg-dark-800/80">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
              
              {/* Vital Signs */}
              <div className="space-y-5">
                <div className="border-b border-white/5 pb-2 mb-4">
                  <h3 className="text-slate-300 font-medium">Demographics & Vitals</h3>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm text-slate-400">Age</label>
                    <span className="text-sm text-white font-medium">{formData.age} years</span>
                  </div>
                  <input type="range" min="18" max="100" value={formData.age} onChange={e => setFormData({...formData, age: +e.target.value})} className="w-full accent-teal-400" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Sex</label>
                    <select value={formData.gender} onChange={e => setFormData({...formData, gender: +e.target.value})} className="glass-select py-2">
                      <option value={1}>Female</option>
                      <option value={2}>Male</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Weight (kg)</label>
                    <input type="number" value={formData.weight} onChange={e => setFormData({...formData, weight: +e.target.value})} className="glass-input py-2" />
                  </div>
                </div>
              </div>

              {/* Hemodynamics */}
              <div className="space-y-5">
                <div className="border-b border-white/5 pb-2 mb-4">
                  <h3 className="text-slate-300 font-medium">Blood Pressure</h3>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm text-slate-400">Systolic (mmHg)</label>
                    <span className="text-sm text-white font-medium">{formData.ap_hi}</span>
                  </div>
                  <input type="range" min="90" max="200" value={formData.ap_hi} onChange={e => setFormData({...formData, ap_hi: +e.target.value})} className="w-full accent-coral-500" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm text-slate-400">Diastolic (mmHg)</label>
                    <span className="text-sm text-white font-medium">{formData.ap_lo}</span>
                  </div>
                  <input type="range" min="60" max="130" value={formData.ap_lo} onChange={e => setFormData({...formData, ap_lo: +e.target.value})} className="w-full accent-coral-500" />
                </div>
              </div>

              {/* Lab & Lifestyle */}
              <div className="space-y-5">
                <div className="border-b border-white/5 pb-2 mb-4">
                  <h3 className="text-slate-300 font-medium">Labs & Lifestyle</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Cholesterol</label>
                    <select value={formData.cholesterol} onChange={e => setFormData({...formData, cholesterol: +e.target.value})} className="glass-select py-2">
                      <option value={1}>Normal</option>
                      <option value={2}>Borderline</option>
                      <option value={3}>High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Glucose</label>
                    <select value={formData.gluc} onChange={e => setFormData({...formData, gluc: +e.target.value})} className="glass-select py-2">
                      <option value={1}>Normal</option>
                      <option value={2}>Elevated</option>
                      <option value={3}>High</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Smoking</label>
                    <select value={formData.smoke} onChange={e => setFormData({...formData, smoke: +e.target.value})} className="glass-select py-2">
                      <option value={0}>No</option>
                      <option value={1}>Yes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Activity</label>
                    <select value={formData.active} onChange={e => setFormData({...formData, active: +e.target.value})} className="glass-select py-2">
                      <option value={1}>Active</option>
                      <option value={0}>Sedentary</option>
                    </select>
                  </div>
                </div>
              </div>

            </div>

            <div className="mt-12 flex flex-col items-center border-t border-white/5 pt-8">
              <AnimatePresence mode="wait">
                {isAnalyzing ? (
                  <motion.div 
                    key="analyzing"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex flex-col items-center"
                  >
                    <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-teal-400 font-medium tracking-wide">{loadingMessages[analysisStep]}</p>
                  </motion.div>
                ) : (
                  <motion.button 
                    key="button"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    onClick={handlePredict}
                    className="bg-teal-500 hover:bg-teal-400 text-dark-900 font-bold rounded-full px-8 py-3 transition-all shadow-[0_0_20px_rgba(0,242,254,0.2)]"
                  >
                    Analyze Health Profile
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.section>

        {/* 3. RESULTS DASHBOARD */}
        <AnimatePresence>
          {analysisComplete && result && (
            <motion.section 
              initial="hidden" animate="visible" variants={fadeUpVariant}
              className="py-16"
            >
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-white mb-2">Assessment Results</h2>
                <p className="text-slate-400">Based on the provided metrics.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* LEFT: Clinical Summary */}
                <div className="glass-card bg-dark-800/90 flex flex-col justify-between">
                  <div>
                    <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-6">Diagnosis</h3>
                    {isHighRisk ? (
                      <div className="mb-4">
                        <div className="inline-flex items-center gap-2 text-coral-500 mb-2">
                          <FileWarning size={24} />
                          <span className="font-bold text-lg">Elevated Risk Detected</span>
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed">
                          The current biometric profile indicates factors commonly associated with increased cardiovascular strain. Preventative measures should be considered.
                        </p>
                      </div>
                    ) : (
                      <div className="mb-4">
                        <div className="inline-flex items-center gap-2 text-teal-400 mb-2">
                          <CheckCircle2 size={24} />
                          <span className="font-bold text-lg">Normal Range</span>
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed">
                          The metrics provided fall within generally healthy parameters. Maintaining current lifestyle habits is recommended.
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-6 border-t border-white/5 mt-6">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Model Reliability</p>
                    <p className="text-white font-medium">{confidence}% confidence</p>
                  </div>
                </div>

                {/* CENTER: Risk Gauge */}
                <div className="glass-card bg-dark-800/90 flex flex-col justify-center items-center py-12">
                  <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-8">Risk Index</h3>
                  
                  <div className="relative h-40 flex items-end justify-center overflow-hidden w-full max-w-[280px]">
                    <div className="absolute top-0 w-full h-[280px] rounded-full border-[12px] border-white/5 border-b-transparent border-l-transparent -rotate-45" />
                    
                    <motion.div 
                      initial={{ rotate: -45 }}
                      animate={{ rotate: -45 + (result.risk_probability / 100) * 180 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className={`absolute top-0 w-full h-[280px] rounded-full border-[12px] border-b-transparent border-l-transparent -rotate-45 ${isHighRisk ? 'border-coral-500' : 'border-teal-400'}`}
                      style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }}
                    />
                    
                    <div className="absolute bottom-0 text-center pb-2">
                      <span className="text-5xl font-bold text-white">{riskProb}%</span>
                    </div>
                  </div>
                </div>

                {/* RIGHT: Key Factors */}
                <div className="glass-card bg-dark-800/90">
                  <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-6">Key Observations</h3>
                  
                  <div className="space-y-4">
                    {formData.ap_hi >= 130 ? (
                      <div className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-coral-500 mt-2 shrink-0" />
                        <div>
                          <p className="text-white text-sm font-medium mb-1">Blood Pressure</p>
                          <p className="text-slate-400 text-xs leading-relaxed">Levels are elevated, putting extra workload on the heart and arteries.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-2 shrink-0" />
                        <div>
                          <p className="text-white text-sm font-medium mb-1">Blood Pressure</p>
                          <p className="text-slate-400 text-xs leading-relaxed">Within a healthy baseline range.</p>
                        </div>
                      </div>
                    )}

                    {formData.cholesterol > 1 && (
                      <div className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-coral-500 mt-2 shrink-0" />
                        <div>
                          <p className="text-white text-sm font-medium mb-1">Cholesterol Profile</p>
                          <p className="text-slate-400 text-xs leading-relaxed">Higher than optimal, which may contribute to plaque buildup over time.</p>
                        </div>
                      </div>
                    )}
                    
                    {formData.smoke === 1 && (
                      <div className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-coral-500 mt-2 shrink-0" />
                        <div>
                          <p className="text-white text-sm font-medium mb-1">Tobacco Use</p>
                          <p className="text-slate-400 text-xs leading-relaxed">A major independent risk factor for vascular damage.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
              </div>
            </motion.section>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}
