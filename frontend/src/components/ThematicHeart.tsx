"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface HeartProps {
  scrollProgress: number;
  isAnalyzing: boolean;
  isHighRisk: boolean;
}

export default function ThematicHeart({ scrollProgress, isAnalyzing, isHighRisk }: HeartProps) {
  // Size and Positioning: Stays more central, embedded in the environment
  const scale = Math.max(0.85, 1.2 - scrollProgress * 0.4);
  const xPos = scrollProgress * 150; 
  const yPos = scrollProgress * 150; 
  const rotate = scrollProgress * -5; 
  
  // Opacity stays higher to keep it as an anchor
  const opacity = Math.max(0.4, 0.9 - scrollProgress * 0.3);

  // Smooth, organic heart pulse animations
  const pulseVariants = {
    calm: {
      scale: [1, 1.015, 1],
      filter: "drop-shadow(0 0 20px rgba(0,242,254,0.1)) brightness(1)",
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const }
    },
    analyzing: {
      scale: [1, 1.04, 1],
      filter: "drop-shadow(0 0 60px rgba(0,242,254,0.4)) brightness(1.3)",
      transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" as const }
    },
    highRisk: {
      scale: [1, 1.05, 1.02, 1.05, 1], 
      filter: "drop-shadow(0 0 80px rgba(230,57,70,0.6)) brightness(0.9)",
      transition: { duration: 1.0, repeat: Infinity, ease: "easeInOut" as const }
    }
  };

  const activeVariant = isAnalyzing ? "analyzing" : (isHighRisk ? "highRisk" : "calm");

  return (
    <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
      
      {/* Dynamic Floating Biomarker Indicators (Contextual Overlays) */}
      <motion.div 
        className="absolute top-1/4 left-1/4 flex flex-col items-end gap-1 opacity-40 mix-blend-screen"
        style={{ y: scrollProgress * -200, x: scrollProgress * -50 }}
      >
        <div className="w-16 h-[1px] bg-teal-400" />
        <span className="text-teal-400 text-[10px] uppercase tracking-widest font-mono">Myocardial Oxygenation</span>
        <span className="text-white text-xs font-mono">{isAnalyzing ? "..." : (isHighRisk ? "94%" : "99%")}</span>
      </motion.div>

      <motion.div 
        className="absolute bottom-1/3 right-1/4 flex flex-col items-start gap-1 opacity-40 mix-blend-screen"
        style={{ y: scrollProgress * -100, x: scrollProgress * 50 }}
      >
        <div className="w-16 h-[1px] bg-coral-500" />
        <span className="text-coral-500 text-[10px] uppercase tracking-widest font-mono">Endothelial Wall Shear</span>
        <span className="text-white text-xs font-mono">{isAnalyzing ? "..." : (isHighRisk ? "ELEVATED" : "NORMAL")}</span>
      </motion.div>

      {/* Main Anatomical Heart */}
      <motion.div
        style={{ scale, x: xPos, y: yPos, rotate, opacity }}
        className="relative z-10"
      >
        <motion.div
          variants={pulseVariants}
          animate={activeVariant}
          className="relative w-[800px] h-[800px] mix-blend-screen"
        >
          <Image 
            src="/assets/media__1779492122478.png" 
            alt="Anatomical Heart"
            fill
            className="object-contain"
            style={{ 
              maskImage: 'radial-gradient(circle, black 50%, transparent 75%)',
              WebkitMaskImage: 'radial-gradient(circle, black 50%, transparent 75%)'
            }}
          />
          
          {/* Inner vascular glow layer */}
          <motion.div 
            className="absolute inset-0 rounded-full"
            animate={{ 
              boxShadow: isAnalyzing 
                ? "inset 0 0 100px rgba(0,242,254,0.3)" 
                : (isHighRisk ? "inset 0 0 120px rgba(230,57,70,0.4)" : "inset 0 0 50px rgba(0,242,254,0.05)")
            }}
            transition={{ duration: 2 }}
          />
        </motion.div>
      </motion.div>
      
      {/* Environmental Foreground Depth Layer (City/Atmosphere) */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-[60vh] w-full opacity-20 mix-blend-screen pointer-events-none"
        style={{ y: scrollProgress * -150 }}
      >
        <Image 
          src="/assets/media__1779492601840.png" 
          alt="Atmospheric City"
          fill
          className="object-cover object-bottom"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/60 to-transparent" />
      </motion.div>
    </div>
  );
}
