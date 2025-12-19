import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, OrbitControls, Html } from '@react-three/drei';
import { Hands } from "@mediapipe/hands";
import Webcam from "react-webcam";

const FloatingCube = ({ onActive }) => {
  const meshRef = useRef();
  const webcamRef = useRef(null);
  const handRotation = useRef({ x: 0, y: 0 });
  const cubeScale = useRef(1.5); // Referência para a escala (evita re-renders lentos)

  useEffect(() => {
    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7, // Aumentado para melhor precisão dos dedos
      minTrackingConfidence: 0.7,
    });

    hands.onResults((results) => {
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        
        // 1. ROTAÇÃO COM EIXO X INVERTIDO (Corrigido conforme pedido)
        const palmCenter = landmarks[9]; 
        handRotation.current.y = (1 - palmCenter.x - 0.5) * 4; 
        handRotation.current.x = (palmCenter.y - 0.5) * 4;

        // 2. LÓGICA DE TAMANHO (ABRIR/FECHAR MÃO)
        // Calculamos a distância entre o polegar (4) e o indicador (8)
        const thumb = landmarks[4];
        const index = landmarks[8];
        
        const distance = Math.sqrt(
          Math.pow(thumb.x - index.x, 2) + 
          Math.pow(thumb.y - index.y, 2)
        );

        // Mapeamento: distância pequena (~0.05) -> escala 0.8 | distância grande (~0.2) -> escala 2.5
        // Ajustamos os valores para o cubo crescer quando abrir a mão
        const targetScale = distance * 8; 
        cubeScale.current = Math.max(0.6, Math.min(targetScale, 3.0)); // Limitadores de segurança
      }
    });

    let cameraActive = true;
    const processVideo = async () => {
      if (webcamRef.current && webcamRef.current.video.readyState === 4) {
        await hands.send({ image: webcamRef.current.video });
      }
      if (cameraActive) requestAnimationFrame(processVideo);
    };

    processVideo();
    return () => { cameraActive = false; hands.close(); };
  }, []);

  useFrame(() => {
    if (meshRef.current) {
      // Suavização da rotação
      meshRef.current.rotation.x += (handRotation.current.x - meshRef.current.rotation.x) * 0.1;
      meshRef.current.rotation.y += (handRotation.current.y - meshRef.current.rotation.y) * 0.1;
      meshRef.current.rotation.z += 0.005;

      // Suavização da escala (Lerp) para não dar trancos
      meshRef.current.scale.lerp({ x: cubeScale.current, y: cubeScale.current, z: cubeScale.current }, 0.1);
    }
  });

  return (
    <>
      <OrbitControls enableZoom={false} enablePan={false} makeDefault />
      
      <Html>
        <Webcam
          ref={webcamRef}
          onUserMedia={() => onActive && onActive()}
          style={{ opacity: 0, pointerEvents: 'none', position: 'absolute', width: '1px', height: '1px' }}
        />
      </Html>

      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={meshRef}>
          <boxGeometry args={[1, 1, 1]} /> {/* Base reduzida para a escala controlar */}
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