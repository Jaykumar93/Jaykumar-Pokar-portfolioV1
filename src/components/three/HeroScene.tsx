"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Float, MeshDistortMaterial, OrbitControls } from "@react-three/drei";

function DistortedBlob() {
  return (
    <Float speed={2} rotationIntensity={1.2} floatIntensity={1.5}>
      <mesh>
        <icosahedronGeometry args={[1.4, 4]} />
        <MeshDistortMaterial
          color="#6366f1"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.15}
          metalness={0.6}
        />
      </mesh>
    </Float>
  );
}

export function HeroScene() {
  return (
    <div className="h-[420px] w-full sm:h-[520px]">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 3, 3]} intensity={1.2} />
        <Suspense fallback={null}>
          <DistortedBlob />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={1.2}
        />
      </Canvas>
    </div>
  );
}
