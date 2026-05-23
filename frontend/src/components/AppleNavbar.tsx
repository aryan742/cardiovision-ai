"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function AppleNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
        scrolled
          ? "bg-[#050505]/75 backdrop-blur-xl border-white/5 py-4"
          : "bg-transparent border-transparent py-6"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Left - Logo */}
        <div className="flex items-center gap-2">
          <span className="text-white font-bold tracking-[0.25em] text-sm uppercase">BIOCORE</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF2D55] shadow-[0_0_8px_rgba(255,45,85,0.6)]" />
        </div>

        {/* Center - Links */}
        <div className="hidden md:flex items-center gap-8">
          {["Overview", "Anatomy", "Circulation", "Structure", "Experience"].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-[11px] text-white/50 hover:text-white uppercase tracking-widest transition-colors font-medium relative group"
            >
              {link}
              <span className="absolute bottom-[-4px] left-0 right-0 h-[1px] bg-[#FF2D55] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            </a>
          ))}
        </div>

        {/* Right - CTA */}
        <div>
          <button 
            onClick={() => {
              const assessmentSec = document.getElementById("assessment");
              if (assessmentSec) {
                assessmentSec.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="relative px-5 py-2 text-xs font-semibold uppercase tracking-widest text-white border border-white/10 rounded-full hover:border-[#FF2D55] transition-colors overflow-hidden group bg-black/40 backdrop-blur-md"
          >
            <div className="absolute inset-0 bg-[#FF2D55]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10">Explore Anatomy</span>
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
