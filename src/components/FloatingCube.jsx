import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';

const FloatingCube = () => {
  const meshRef = useRef();

  useFrame((state) => {
    // Rotação automática suave
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.002;
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <>
      {/* OrbitControls habilita o girar com mouse */}
      <OrbitControls enableZoom={false} enablePan={false} makeDefault />
      
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={meshRef}>
          <boxGeometry args={[1.5, 1.5, 1.5]} />
          <meshStandardMaterial 
            color="#9d50bb" 
            wireframe 
            emissive="#00d2ff"
            emissiveIntensity={2}
          />
        </mesh>
      </Float>
    </>
  );
};

export default FloatingCube;