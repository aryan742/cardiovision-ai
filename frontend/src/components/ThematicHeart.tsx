"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface HeartProps {
  scrollProgress: number;
  isAnalyzing: boolean;
  isHighRisk: boolean;
}

export default function ThematicHeart({ scrollProgress, isAnalyzing, isHighRisk }: HeartProps) {
  // Size and Positioning: 
  // Starts prominent and central, then shrinks and moves to the right/background
  const scale = Math.max(0.7, 1.4 - scrollProgress * 0.8);
  const xPos = scrollProgress * 300; // Moves right
  const yPos = scrollProgress * 200; // Moves down
  const rotate = scrollProgress * 10; // Subtle rotation
  
  // Opacity: Stays visible but dims slightly
  const opacity = Math.max(0.3, 0.8 - scrollProgress * 0.4);

  // High quality, softer heart pulse animations
  const pulseVariants = {
    calm: {
      scale: [1, 1.01, 1],
      filter: "drop-shadow(0 0 10px rgba(230,57,70,0.1)) brightness(1)",
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const }
    },
    analyzing: {
      scale: [1, 1.03, 1],
      filter: "drop-shadow(0 0 30px rgba(0,242,254,0.3)) brightness(1.2)",
      transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" as const }
    },
    highRisk: {
      scale: [1, 1.04, 1.01, 1.04, 1], // Believable double thump
      filter: "drop-shadow(0 0 40px rgba(230,57,70,0.4)) brightness(0.9)",
      transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" as const }
    }
  };

  const activeVariant = isAnalyzing ? "analyzing" : (isHighRisk ? "highRisk" : "calm");

  return (
    <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
      {/* City Skyline Environment Layer (parallax background) */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-[40vh] w-full opacity-10 mix-blend-screen"
        style={{ y: scrollProgress * -100 }}
      >
        <Image 
          src="/assets/media__1779492601840.png" 
          alt="Atmospheric City"
          fill
          className="object-cover object-bottom"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent" />
      </motion.div>

      <motion.div
        style={{
          scale,
          x: xPos,
          y: yPos,
          rotate,
          opacity,
        }}
        className="relative z-10"
      >
        <motion.div
          variants={pulseVariants}
          animate={activeVariant}
          className="relative w-[700px] h-[700px] mix-blend-screen"
        >
          {/* We use a high-quality, semi-realistic anatomical heart image */}
          <Image 
            src="/assets/media__1779492122478.png" 
            alt="Anatomical Heart"
            fill
            className="object-contain"
            style={{ 
              maskImage: 'radial-gradient(circle, black 50%, transparent 80%)',
              WebkitMaskImage: 'radial-gradient(circle, black 50%, transparent 80%)'
            }}
          />
        </motion.div>
      </motion.div>
      
      {/* Restrained Ambient lighting */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,242,254,0.02)_0%,transparent_50%)]"
        style={{ opacity: isAnalyzing ? 1 : 0, transition: "opacity 1.5s ease" }} 
      />
      <div 
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(230,57,70,0.03)_0%,transparent_60%)]"
        style={{ opacity: isHighRisk && !isAnalyzing ? 1 : 0, transition: "opacity 2s ease" }} 
      />
    </div>
  );
}
