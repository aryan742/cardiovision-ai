"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HeartSequenceProps {
  scrollProgress: number;
  onLoadingComplete: () => void;
}

export default function HeartSequenceCanvas({ scrollProgress, onLoadingComplete }: HeartSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const totalFrames = 240;

  // Preload all frames
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let count = 0;

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const frameStr = String(i).padStart(3, "0");
      img.src = `/assets/heart_sequence/ezgif-frame-${frameStr}.jpg`;
      
      img.onload = () => {
        count++;
        setLoadedCount(count);
        if (count === totalFrames) {
          setImages(loadedImages);
          setIsLoaded(true);
          onLoadingComplete();
        }
      };
      
      img.onerror = () => {
        count++;
        setLoadedCount(count);
        if (count === totalFrames) {
          setIsLoaded(true);
          onLoadingComplete();
        }
      };

      loadedImages.push(img);
    }
  }, [onLoadingComplete]);

  // Handle canvas sizing ONCE and on window resize only
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };

    if (isLoaded) {
      // Give a tiny timeout for rect layout to compute correctly
      setTimeout(handleResize, 100);
      window.addEventListener("resize", handleResize);
    }

    return () => window.removeEventListener("resize", handleResize);
  }, [isLoaded]);

  // High performance render loop (renders ONLY when scrollProgress or images change, without resizing)
  useEffect(() => {
    if (!isLoaded || images.length === 0 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    
    // Calculate target frame index using smooth scroll progression mapping
    const frameIndex = Math.min(
      totalFrames - 1,
      Math.max(0, Math.floor(scrollProgress * totalFrames))
    );

    const img = images[frameIndex];
    if (img && img.complete) {
      ctx.clearRect(0, 0, rect.width, rect.height);
      
      // Black background fill to ensure perfect blending
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Fit image inside canvas while maintaining aspect ratio (contain)
      const imgWidth = img.width;
      const imgHeight = img.height;
      const scaleX = rect.width / imgWidth;
      const scaleY = rect.height / imgHeight;
      const scale = Math.min(scaleX, scaleY) * 0.95; // slightly scaled down for premium framing

      const w = imgWidth * scale;
      const h = imgHeight * scale;
      const x = (rect.width - w) / 2;
      const y = (rect.height - h) / 2;

      ctx.drawImage(img, x, y, w, h);
    }
  }, [scrollProgress, images, isLoaded]);

  const progressPercentage = Math.round((loadedCount / totalFrames) * 100);

  return (
    <div className="relative w-full h-full">
      {/* Loading overlay for Awwwards-level preloading aesthetics */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0 z-50 flex flex-col justify-center items-center bg-[#050505]"
          >
            <div className="max-w-md w-full px-6 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] text-teal-400 font-mono tracking-[0.25em] uppercase">Biocore Systems</span>
                  <span className="text-sm text-white font-mono">{progressPercentage}%</span>
                </div>
                <h3 className="text-white text-lg font-light tracking-wider">PRELOADING TELEMETRY DATA</h3>
              </div>
              
              {/* Progress bar */}
              <div className="h-[1px] w-full bg-white/10 overflow-hidden relative">
                <motion.div 
                  className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-teal-400 to-[#FF2D55]"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              <span className="block text-[9px] text-white/30 font-mono tracking-widest text-center uppercase">
                Initializing photorealistic anatomical reconstruction
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HTML5 Canvas */}
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block bg-[#050505] transition-opacity duration-700"
        style={{ opacity: isLoaded ? 1 : 0 }}
      />
    </div>
  );
}
