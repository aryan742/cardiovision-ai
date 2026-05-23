"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function BackgroundEnvironment() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Generate random particles for "blood flow / oxygen" feel
  const particles = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    size: Math.random() * 4 + 1,
    xStart: Math.random() * 100,
    yStart: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 10,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-dark-900">
      
      {/* 1. Deep Atmospheric Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(10,30,50,0.8),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(40,10,20,0.6),transparent_50%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-900/80 to-dark-900" />
      
      {/* 2. Medical Texture Overlay (Grid/Noise) */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" 
           style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* 3. Biological Particle System */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-teal-400/20 blur-[1px]"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.xStart}%`,
            top: `${p.yStart}%`,
          }}
          animate={{
            y: ["0vh", "-100vh"],
            x: ["0vw", `${Math.random() * 20 - 10}vw`],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* 4. Subliminal ECG Line Animation */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <svg width="200%" height="100%" viewBox="0 0 1000 200" preserveAspectRatio="none" className="w-full">
          <motion.path
            d="M 0 100 L 400 100 L 420 50 L 440 150 L 460 30 L 480 180 L 500 100 L 1000 100"
            fill="none"
            stroke="#00f2fe"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 1, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
        </svg>
      </div>

    </div>
  );
}
