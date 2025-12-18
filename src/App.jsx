import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import AboutMe from './components/AboutMe';
import Skills from './components/Skills';
import Services from './components/Services';
import IntroScreen from './components/IntroScreen';
import Contact from './components/Contact';
import ChromeDinoGame from 'react-chrome-dino';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { Canvas } from '@react-three/fiber';
import FloatingCube from './components/FloatingCube';

function App() {
  const colors = {
    dark: '#05070a',
    blue: '#00d2ff',
    purple: '#9d50bb',
    textGray: '#888888',
    terminalGreen: '#00ff00' 
  };

  const [showIntro, setShowIntro] = useState(true);
  const [showDino, setShowDino] = useState(false);
  const [keys, setKeys] = useState('');
  const [displayedText, setDisplayedText] = useState("");
  
  // 1. Mudança para áudio mais robusto: Instanciação direta
  const handleIntroComplete = () => {
    setShowIntro(false);
    
    // Criar o áudio aqui garante que o navegador aceite o 'play' 
    // porque o clique veio do botão da IntroScreen
    const startupSound = new Audio('/sounds/startup.mp3');
    startupSound.volume = 0.4;
    startupSound.play().catch(error => console.log("Erro ao tocar áudio:", error));
  };

  useEffect(() => {
    if (!showIntro) {
      let currentPhraseIndex = 0;
      let currentCharIndex = 0;
      let isDeleting = false;
      let typingSpeed = 100;

      const type = () => {
        const currentFullText = phrases[currentPhraseIndex];
        
        if (isDeleting) {
          setDisplayedText(currentFullText.substring(0, currentCharIndex - 1));
          currentCharIndex--;
          typingSpeed = 50;
        } else {
          setDisplayedText(currentFullText.substring(0, currentCharIndex + 1));
          currentCharIndex++;
          typingSpeed = 100;
        }

        if (!isDeleting && currentCharIndex === currentFullText.length) {
          isDeleting = true;
          typingSpeed = 2000;
        } else if (isDeleting && currentCharIndex === 0) {
          isDeleting = false;
          currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
          typingSpeed = 500;
        }
        setTimeout(type, typingSpeed);
      };

      const initialTimeout = setTimeout(type, 500);
      return () => clearTimeout(initialTimeout);
    }
  }, [showIntro]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showDino) return;
      const newKeys = (keys + e.key).toLowerCase().slice(-4);
      setKeys(newKeys);
      if (newKeys === 'dino') setShowDino(true);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keys, showDino]);

  const phrases = [
    "Onde a precisão da Engenharia da Computação encontra a alma da narrativa autoral.",
    "Transformando cenários irreais em realidade.",
    "Interatividade que conecta.",
    "Transcendendo o óbvio para libertar visões originais."
  ];

  return (
    <AnimatePresence mode="wait">
      {/* Camada Global de Scanlines */}
      <motion.div
        key="global-scanlines"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 0.4, 
          background: showIntro 
            ? `repeating-linear-gradient(rgba(0, 0, 0, 0) 0px, rgba(0, 0, 0, 0) 1px, ${colors.terminalGreen}66 2px, ${colors.terminalGreen}66 3px)`
            : `repeating-linear-gradient(rgba(0, 0, 0, 0) 0px, rgba(0, 0, 0, 0) 1px, ${colors.blue}55 2px, ${colors.blue}55 3px)`
        }}
        transition={{ duration: 2 }}
        style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundSize: '100% 4px', pointerEvents: 'none', zIndex: 10000
        }}
      />

      {showIntro ? (
        <IntroScreen key="intro" onComplete={handleIntroComplete} />
      ) : (
        <motion.div
          key="main-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{ 
            backgroundColor: colors.dark, 
            color: 'white', 
            minHeight: '100vh', 
            fontFamily: '"Inter", sans-serif',
            overflowX: 'hidden'
          }}
        >
          <Navbar />

          <header style={{ 
            display: 'flex', flexDirection: 'column', alignItems: 'center', 
            justifyContent: 'center', minHeight: '100vh', textAlign: 'center', padding: '0 20px'
          }}>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{ color: colors.blue, letterSpacing: '8px', textTransform: 'uppercase', fontSize: '0.9rem', marginBottom: '20px' }}
            >
              Iniciando Transmissão
            </motion.p>

            <h1 style={{ 
              fontSize: 'clamp(2.5rem, 8vw, 5.5rem)', 
              fontWeight: '900', lineHeight: '1.1', textTransform: 'uppercase', margin: 0
            }}>
              BEM VINDO A
             <span style={{ background: `linear-gradient(to right, ${colors.blue}, ${colors.purple})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}> MEU MUNDO.</span>
            </h1>

            <div style={{ minHeight: '1.5em', marginTop: '30px', fontSize: '1.5rem', color: colors.textGray }}>
              <span>{displayedText}</span>
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                style={{ 
                  display: 'inline-block', width: '3px', height: '1em', 
                  backgroundColor: colors.blue, marginLeft: '5px', verticalAlign: 'middle' 
                }}
              />
            </div>

            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}
              style={{ marginTop: '60px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <span style={{ fontSize: '0.7rem', color: colors.blue, letterSpacing: '3px', textTransform: 'uppercase' }}>Explorar Jornada</span>
              <div style={{ width: '1px', height: '40px', background: `linear-gradient(to bottom, ${colors.blue}, transparent)`, marginTop: '10px' }}></div>
            </motion.div>

            {/* CUBO 3D: Subiu de posição com margem negativa maior */}
            <div style={{
              width: '100%',
              height: '350px',
              marginTop: '0px', 
              position: 'relative',
              zIndex: 2,
              cursor: 'grab' // Cursor de mão para indicar que é arrastável
            }}>
              <Canvas camera={{ position: [0, 0, 4], fov: 40 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} color={colors.blue} intensity={2} />
                <FloatingCube />
              </Canvas>
            </div>
          </header>

          <AboutMe />
          <Skills />
          <Services />
          <Contact />
          
          {/* ... Footer e DinoGame ... */}
          <footer style={{ padding: '60px 40px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '30px' }}>
              <motion.a href="https://github.com/seu-perfil" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.2, color: colors.blue }} style={{ color: 'white', fontSize: '1.8rem' }}><FaGithub /></motion.a>
              <motion.a href="https://linkedin.com/in/seu-perfil" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.2, color: colors.blue }} style={{ color: 'white', fontSize: '1.8rem' }}><FaLinkedin /></motion.a>
              <motion.a href="https://instagram.com/seu-perfil" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.2, color: colors.blue }} style={{ color: 'white', fontSize: '1.8rem' }}><FaInstagram /></motion.a>
            </div>
            <p style={{ fontSize: '0.8rem', color: colors.textGray }}>© 2025 UpixelStudios - Todos os direitos reservados.</p>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;