"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Float, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

interface HeartProps {
  scrollProgress: number;
  isAnalyzing: boolean;
  isHighRisk: boolean;
}

function PulsingCore({ scrollProgress, isAnalyzing, isHighRisk }: HeartProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Base properties
  const baseScale = Math.max(1.5, 3 - scrollProgress * 1.5);
  const rotationY = scrollProgress * Math.PI * 2;
  const positionX = scrollProgress * 3; // Moves right
  
  // State-driven properties
  const distortSpeed = isAnalyzing ? 8 : (isHighRisk ? 6 : 3);
  const distortAmount = isAnalyzing ? 0.6 : (isHighRisk ? 0.4 : 0.3);
  const color = isHighRisk ? "#ff1a1a" : "#e63946";
  const emissiveIntensity = isAnalyzing ? 2 : (isHighRisk ? 1.5 : 0.5);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Heartbeat pulse logic
    const time = state.clock.getElapsedTime();
    // Simulate heartbeat: quick double thump
    const thump = Math.sin(time * (isAnalyzing ? 10 : (isHighRisk ? 8 : 4)));
    const pulseScale = 1 + (thump > 0.8 ? 0.05 : 0);
    
    meshRef.current.scale.setScalar(baseScale * pulseScale);
    meshRef.current.rotation.y = rotationY + time * 0.2;
    meshRef.current.position.x = positionX;
    
    // Ambient floating
    meshRef.current.position.y = Math.sin(time * 0.5) * 0.2;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          roughness={0.2}
          metalness={0.8}
          distort={distortAmount}
          speed={distortSpeed}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
    </Float>
  );
}

export default function ThematicHeart({ scrollProgress, isAnalyzing, isHighRisk }: HeartProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
        <spotLight position={[-10, 0, 15]} intensity={2} color="#00f2fe" />
        
        <PulsingCore 
          scrollProgress={scrollProgress} 
          isAnalyzing={isAnalyzing} 
          isHighRisk={isHighRisk} 
        />
        
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
