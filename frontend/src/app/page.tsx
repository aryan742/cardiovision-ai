"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import axios from "axios";
import ThematicHeart from "@/components/ThematicHeart";
import { Activity, HeartPulse, Dna, FileWarning, ShieldCheck, ChevronDown } from "lucide-react";

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
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  // Track scroll for the 3D heart
  useEffect(() => {
    return scrollYProgress.onChange((latest) => {
      setScrollProgress(latest);
    });
  }, [scrollYProgress]);

  const handlePredict = async () => {
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    
    // Convert age to days as expected by the model
    const payload = {
      ...formData,
      age: formData.age * 365.25
    };
    
    try {
      // Fake delay for cinematic effect
      await new Promise((resolve) => setTimeout(resolve, 3500));
      
      const response = await axios.post("http://localhost:8000/api/predict", payload);
      setResult(response.data);
      setAnalysisComplete(true);
      
      // Auto scroll to results
      setTimeout(() => {
        window.scrollBy({ top: 800, behavior: "smooth" });
      }, 500);
    } catch (error) {
      console.error("Prediction failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const isHighRisk = result?.risk_level === "High Risk";

  return (
    <main className="relative min-h-screen pb-32">
      {/* 3D Background Element */}
      <ThematicHeart 
        scrollProgress={scrollProgress} 
        isAnalyzing={isAnalyzing} 
        isHighRisk={isHighRisk} 
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        
        {/* 1. HERO SECTION */}
        <section className="min-h-screen flex flex-col justify-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-3 bg-teal-400/10 border border-teal-400/30 rounded-full px-4 py-2 mb-8 backdrop-blur-md">
              <div className="w-2 h-2 bg-coral-500 rounded-full animate-ping" />
              <span className="text-teal-400 text-xs font-bold tracking-widest uppercase">Diagnostic Engine Online</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              CardioVision <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">AI</span>
            </h1>
            
            <p className="text-xl text-slate-400 leading-relaxed mb-10 max-w-xl">
              A cinematic clinical intelligence platform. We translate complex physiological biomarkers into predictive cardiovascular insights using production-grade machine learning.
            </p>
            
            <button 
              onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
              className="btn-primary"
            >
              Start Clinical Assessment
            </button>
          </motion.div>
          
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-500"
          >
            <ChevronDown size={32} />
          </motion.div>
        </section>

        {/* 2. INTRODUCTION */}
        <section className="min-h-[50vh] flex items-center justify-center py-20">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center max-w-3xl"
          >
            <h2 className="text-4xl font-bold mb-6">Beyond the <span className="text-teal-400">Black Box</span></h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              Modern medicine requires transparency. By integrating robust predictive modeling with an immersive, step-by-step diagnostic journey, CardioVision AI reveals the physiological narrative driving cardiovascular deterioration before it becomes critical.
            </p>
          </motion.div>
        </section>

        {/* 3. INTERACTIVE INPUT SECTION */}
        <section className="min-h-screen py-20 flex flex-col justify-center">
          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-4">Patient <span className="text-coral-500">Biomarkers</span></h2>
            <p className="text-slate-400 text-lg">Define the clinical vector for predictive analysis.</p>
          </div>

          <div className="glass-card">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              
              {/* Vital Signs */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-teal-400 mb-4">
                  <Activity size={20} />
                  <h3 className="font-bold uppercase tracking-wider text-sm">Vital Signs</h3>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-2 uppercase tracking-wider">Chronological Age</label>
                  <input type="number" value={formData.age} onChange={e => setFormData({...formData, age: +e.target.value})} className="glass-input" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-2 uppercase tracking-wider">Biological Sex</label>
                  <select value={formData.gender} onChange={e => setFormData({...formData, gender: +e.target.value})} className="glass-select">
                    <option value={1}>Female</option>
                    <option value={2}>Male</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-2 uppercase tracking-wider">Body Mass (kg)</label>
                  <input type="number" value={formData.weight} onChange={e => setFormData({...formData, weight: +e.target.value})} className="glass-input" />
                </div>
              </div>

              {/* Hemodynamics */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-coral-500 mb-4">
                  <HeartPulse size={20} />
                  <h3 className="font-bold uppercase tracking-wider text-sm">Hemodynamics</h3>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-2 uppercase tracking-wider">Systolic Pressure</label>
                  <input type="number" value={formData.ap_hi} onChange={e => setFormData({...formData, ap_hi: +e.target.value})} className="glass-input" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-2 uppercase tracking-wider">Diastolic Pressure</label>
                  <input type="number" value={formData.ap_lo} onChange={e => setFormData({...formData, ap_lo: +e.target.value})} className="glass-input" />
                </div>
              </div>

              {/* Biomarkers */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-teal-400 mb-4">
                  <Dna size={20} />
                  <h3 className="font-bold uppercase tracking-wider text-sm">Metabolics</h3>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-2 uppercase tracking-wider">Lipid Profile</label>
                  <select value={formData.cholesterol} onChange={e => setFormData({...formData, cholesterol: +e.target.value})} className="glass-select">
                    <option value={1}>Grade 1 (Normal)</option>
                    <option value={2}>Grade 2 (Elevated)</option>
                    <option value={3}>Grade 3 (High)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-2 uppercase tracking-wider">Fasting Glucose</label>
                  <select value={formData.gluc} onChange={e => setFormData({...formData, gluc: +e.target.value})} className="glass-select">
                    <option value={1}>Normal</option>
                    <option value={2}>Elevated</option>
                    <option value={3}>Diabetic</option>
                  </select>
                </div>
              </div>

              {/* Lifestyle */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-coral-500 mb-4">
                  <ShieldCheck size={20} />
                  <h3 className="font-bold uppercase tracking-wider text-sm">Lifestyle</h3>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-2 uppercase tracking-wider">Tobacco Status</label>
                  <select value={formData.smoke} onChange={e => setFormData({...formData, smoke: +e.target.value})} className="glass-select">
                    <option value={0}>Non-Smoker</option>
                    <option value={1}>Active User</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-2 uppercase tracking-wider">Physical Activity</label>
                  <select value={formData.active} onChange={e => setFormData({...formData, active: +e.target.value})} className="glass-select">
                    <option value={1}>Active Profile</option>
                    <option value={0}>Sedentary</option>
                  </select>
                </div>
              </div>

            </div>

            <div className="mt-12 flex justify-center">
              <button 
                onClick={handlePredict}
                disabled={isAnalyzing}
                className="btn-primary flex items-center gap-3 disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Analyzing Biomarkers...
                  </>
                ) : "Run Diagnostic Protocol"}
              </button>
            </div>
          </div>
        </section>

        {/* 4. AI ANALYSIS SEQUENCE & 5. RESULTS DASHBOARD */}
        <AnimatePresence>
          {analysisComplete && result && (
            <motion.section 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="py-20"
            >
              <div className="mb-12">
                <h2 className="text-4xl font-bold mb-4">Clinical <span className="text-teal-400">Intelligence</span></h2>
                <p className="text-slate-400 text-lg">Predictive inference generated from multi-variable XGBoost matrices.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Status Card */}
                <div className={`glass-card flex flex-col justify-center items-center text-center ${isHighRisk ? 'border-coral-500/50 shadow-[0_0_50px_rgba(230,57,70,0.15)]' : 'border-teal-400/50'}`}>
                  <FileWarning size={48} className={isHighRisk ? "text-coral-500 mb-6" : "text-teal-400 mb-6"} />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Diagnostic Classification</h3>
                  <h2 className={`text-3xl font-extrabold leading-tight mb-4 ${isHighRisk ? "text-coral-500" : "text-teal-400"}`}>
                    {isHighRisk ? "CRITICAL RISK FLAGGED" : "PHYSIOLOGICAL NORMAL"}
                  </h2>
                  <p className="text-slate-400">Model Confidence: <strong className="text-white">{result.confidence}%</strong></p>
                </div>

                {/* Gauge Card */}
                <div className="glass-card lg:col-span-2 flex flex-col justify-center">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-8">Systemic Risk Coefficient</h3>
                  
                  <div className="relative h-48 flex items-end justify-center overflow-hidden">
                    {/* Semi-circle Gauge Background */}
                    <div className="absolute top-0 w-80 h-80 rounded-full border-[20px] border-dark-900 border-b-transparent border-l-transparent -rotate-45" />
                    
                    {/* Animated Gauge Fill */}
                    <motion.div 
                      initial={{ rotate: -45 }}
                      animate={{ rotate: -45 + (result.risk_probability / 100) * 180 }}
                      transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                      className={`absolute top-0 w-80 h-80 rounded-full border-[20px] border-b-transparent border-l-transparent -rotate-45 ${isHighRisk ? 'border-coral-500' : 'border-teal-400'}`}
                      style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }}
                    />
                    
                    <div className="absolute bottom-0 text-center pb-4">
                      <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2 }}
                        className="text-6xl font-black text-white"
                      >
                        {result.risk_probability}%
                      </motion.span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 6. EXPLAINABILITY SECTION */}
              <div className="mt-20 mb-12">
                <h2 className="text-3xl font-bold mb-4">Why This <span className="text-coral-500">Prediction?</span></h2>
                <p className="text-slate-400 text-lg">Algorithmic attribution mapped to physiological factors.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {formData.ap_hi >= 130 && (
                  <div className="glass-card">
                    <h4 className="text-coral-500 font-bold mb-2">Hypertensive Strain</h4>
                    <p className="text-sm text-slate-400">Systolic pressure of {formData.ap_hi} mmHg exerts severe mechanical stress on vascular endothelium, accelerating plaque deposition.</p>
                    <div className="mt-4 text-xs font-bold text-coral-500 uppercase tracking-wider">+ High Impact Weight</div>
                  </div>
                )}
                
                {formData.cholesterol >= 2 && (
                  <div className="glass-card">
                    <h4 className="text-coral-500 font-bold mb-2">Lipid Accumulation</h4>
                    <p className="text-sm text-slate-400">Grade {formData.cholesterol} serum cholesterol provides the building blocks for atherosclerotic blockages within narrowed arteries.</p>
                    <div className="mt-4 text-xs font-bold text-coral-500 uppercase tracking-wider">+ Moderate Impact Weight</div>
                  </div>
                )}

                {formData.smoke === 1 && (
                  <div className="glass-card">
                    <h4 className="text-coral-500 font-bold mb-2">Endothelial Toxicity</h4>
                    <p className="text-sm text-slate-400">Active tobacco use induces immediate arterial vasoconstriction and chronic systemic inflammation.</p>
                    <div className="mt-4 text-xs font-bold text-coral-500 uppercase tracking-wider">+ High Impact Weight</div>
                  </div>
                )}
              </div>

              {/* 7. RECOMMENDATIONS */}
              <div className="mt-20">
                <div className="glass-card bg-gradient-to-br from-dark-800 to-dark-900 border-teal-400/20">
                  <h3 className="text-2xl font-bold text-white mb-6">Preventative Architecture</h3>
                  <ul className="space-y-4 text-slate-300">
                    <li className="flex items-start gap-3">
                      <ShieldCheck className="text-teal-400 shrink-0 mt-1" size={20} />
                      <p><strong>Vasodilation Protocols:</strong> Engage in 150+ minutes of zone-2 cardiovascular training weekly to expand capillary networks and reduce resting systemic pressure.</p>
                    </li>
                    {isHighRisk && (
                      <li className="flex items-start gap-3">
                        <ShieldCheck className="text-teal-400 shrink-0 mt-1" size={20} />
                        <p><strong>Clinical Escalarion:</strong> Based on the high-risk coefficient, an immediate consultation with a cardiologist is recommended for advanced lipid paneling and potential pharmacological intervention.</p>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}
