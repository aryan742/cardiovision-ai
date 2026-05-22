"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface HeartProps {
  scrollProgress: number;
  isAnalyzing: boolean;
  isHighRisk: boolean;
}

export default function ThematicHeart({ scrollProgress, isAnalyzing, isHighRisk }: HeartProps) {
  // Define dynamic properties based on state and scroll
  
  // Size and Positioning: Starts prominent, moves to the side as you scroll
  const scale = Math.max(0.6, 1.2 - scrollProgress * 0.4);
  const xPos = scrollProgress * 200; // Moves slightly right
  const yPos = scrollProgress * 150; // Moves slightly down
  const rotate = scrollProgress * 15; // Subtle rotation
  
  // Opacity: Fades slightly to become a background element
  const opacity = Math.max(0.15, 0.4 - scrollProgress * 0.2);

  // Pulse animation variants
  const pulseVariants = {
    calm: {
      scale: [1, 1.02, 1],
      filter: "drop-shadow(0 0 20px rgba(230,57,70,0.1))",
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
    },
    analyzing: {
      scale: [1, 1.05, 1],
      filter: "drop-shadow(0 0 40px rgba(0,242,254,0.3))",
      transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
    },
    highRisk: {
      scale: [1, 1.08, 1.02, 1.08, 1], // Double thump heartbeat
      filter: "drop-shadow(0 0 50px rgba(230,57,70,0.5))",
      transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
    }
  };

  const activeVariant = isAnalyzing ? "analyzing" : (isHighRisk ? "highRisk" : "calm");

  return (
    <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
      <motion.div
        style={{
          scale,
          x: xPos,
          y: yPos,
          rotate,
          opacity,
        }}
        className="relative"
      >
        <motion.div
          variants={pulseVariants}
          animate={activeVariant}
          className="relative w-[600px] h-[600px] mix-blend-screen"
        >
          {/* We use the anatomical image with CSS masking and blending for a premium look */}
          <Image 
            src="/assets/heart_vessel_anatomy.jpg" 
            alt="Anatomical Heart"
            fill
            className="object-contain opacity-80"
            style={{ 
              maskImage: 'radial-gradient(circle, black 40%, transparent 70%)',
              WebkitMaskImage: 'radial-gradient(circle, black 40%, transparent 70%)'
            }}
          />
        </motion.div>
      </motion.div>
      
      {/* Subtle ambient lighting layer */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,242,254,0.03)_0%,transparent_50%)]"
        style={{ 
          opacity: isAnalyzing ? 1 : 0, 
          transition: "opacity 1s ease-in-out" 
        }} 
      />
      <div 
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(230,57,70,0.05)_0%,transparent_60%)]"
        style={{ 
          opacity: isHighRisk && !isAnalyzing ? 1 : 0, 
          transition: "opacity 2s ease-in-out" 
        }} 
      />
    </div>
  );
}
