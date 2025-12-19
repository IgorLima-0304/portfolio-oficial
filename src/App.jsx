import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

// Importação de Componentes
import Navbar from './components/Navbar';
import AboutMe from './components/AboutMe';
import Skills from './components/Skills';
import Services from './components/Services';
import IntroScreen from './components/IntroScreen';
import Contact from './components/Contact';
import FloatingCube from './components/FloatingCube';
import ChromeDinoGame from 'react-chrome-dino';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';

// --- FIREWALL DE ROTA ---
const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ backgroundColor: '#05070a', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#00ff00', fontFamily: 'monospace' }}>
        VERIFICANDO_AUTORIZACAO...
      </div>
    );
  }

  return user ? children : <Navigate to="/admin" />;
};

// --- COMPONENTE DA HOME PRINCIPAL ---
const MainHome = ({ colors }) => {
  const [showIntro, setShowIntro] = useState(true);
  const [displayedText, setDisplayedText] = useState("");
  const [showDino, setShowDino] = useState(false);
  const [keys, setKeys] = useState('');

  // ESTADO PARA GEOLOCALIZAÇÃO
  const [networkData, setNetworkData] = useState({ city: "LOCALIZANDO...", org: "IDENTIFICANDO..." });

  const [integrityClicks, setIntegrityClicks] = useState(0);

  const phrases = [
    "Onde a precisão da Engenharia da Computação encontra a alma da narrativa autoral.",
    "Transformando cenários irreais em realidade.",
    "Interatividade que conecta.",
    "Transcendendo o óbvio para libertar visões originais."
  ];

  useEffect(() => {
    if (!showIntro) {

      fetch('http://ip-api.com/json/')
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            setNetworkData({
              city: data.city.toUpperCase(),
              org: data.isp.toUpperCase()
            });
          } else {
            throw new Error("Falha na localização");
          }
        })
        .catch((err) => {
          console.warn("Erro de Rastreio:", err);

          setNetworkData({
            city: "SETOR_7",
            org: "VAULT-TEC_NETWORK"
          });
        });
    }
  }, [showIntro]);

  const handleIntroComplete = () => {
    setShowIntro(false);
    const startupSound = new Audio('/sounds/startup.mp3');
    startupSound.volume = 0.4;
    startupSound.play().catch(error => console.log("Áudio aguardando interação:", error));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showDino || showIntro) return;
      const newKeys = (keys + e.key).toLowerCase().slice(-4);
      setKeys(newKeys);
      if (newKeys === 'dino') setShowDino(true);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keys, showDino, showIntro]);

  const handleIntegrityClick = () => {
    const nextClicks = integrityClicks + 1;
    setIntegrityClicks(nextClicks);
    if (nextClicks >= 3) {
      setShowDino(true);
      setIntegrityClicks(0);
    }
  };

  useEffect(() => {
    if (!showIntro) {
      let currentPhraseIndex = 0;
      let currentCharIndex = 0;
      let isDeleting = false;

      const type = () => {
        const currentFullText = phrases[currentPhraseIndex];
        setDisplayedText(currentFullText.substring(0, isDeleting ? currentCharIndex - 1 : currentCharIndex + 1));

        if (!isDeleting) currentCharIndex++;
        else currentCharIndex--;

        if (!isDeleting && currentCharIndex === currentFullText.length) {
          isDeleting = true;
          setTimeout(type, 2000);
        } else if (isDeleting && currentCharIndex === 0) {
          isDeleting = false;
          currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
          setTimeout(type, 500);
        } else {
          setTimeout(type, isDeleting ? 50 : 100);
        }
      };
      const timer = setTimeout(type, 500);
      return () => clearTimeout(timer);
    }
  }, [showIntro]);

  return (
    <AnimatePresence mode="wait">
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

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                fontFamily: 'monospace',
                fontSize: '0.65rem',
                color: colors.blue,
                marginBottom: '15px',
                border: `1px solid ${colors.blue}44`,
                padding: '5px 15px',
                borderRadius: '20px',
                backgroundColor: `${colors.blue}11`,
                textShadow: `0 0 5px ${colors.blue}`
              }}
            >
              [ ORIGEM_DO_SINAL: {networkData.city} // NODE_ID: {networkData.org} ]
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ color: colors.blue, letterSpacing: '8px', textTransform: 'uppercase', fontSize: '0.9rem', marginBottom: '20px' }}
            >
              Conexão Estabelecida
            </motion.p>

            <h1 style={{ fontSize: 'clamp(2.0rem, 6vw, 4.5rem)', fontWeight: '900', lineHeight: '1.2', textTransform: 'uppercase', margin: 0 }}>
              BEM-VINDO, <br />
              VIAJANTE DE{" "} {/* Este {" "} força o React a renderizar um espaço real */}
              <span style={{
                background: `linear-gradient(to right, ${colors.blue}, ${colors.purple})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {networkData.city}
              </span>
            </h1>

            <div style={{ minHeight: '1.5em', marginTop: '30px', fontSize: '1.5rem', color: colors.textGray }}>
              <span>{displayedText}</span>
              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.8, repeat: Infinity }} style={{ display: 'inline-block', width: '3px', height: '1em', backgroundColor: colors.blue, marginLeft: '5px', verticalAlign: 'middle' }} />
            </div>

            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })} style={{ marginTop: '60px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: colors.blue, letterSpacing: '3px', textTransform: 'uppercase' }}>Explorar Jornada</span>
              <div style={{ width: '1px', height: '40px', background: `linear-gradient(to bottom, ${colors.blue}, transparent)`, marginTop: '10px' }}></div>
            </motion.div>

            <div style={{ width: '100%', height: '350px', marginTop: '0px', position: 'relative', zIndex: 2, cursor: 'grab' }}>
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

          <footer style={{ padding: '60px 40px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '30px' }}>
              <motion.a href="https://github.com/IgorLima-0304" target="_blank" whileHover={{ scale: 1.2, color: colors.blue }} style={{ color: 'white', fontSize: '1.8rem' }}><FaGithub /></motion.a>
              <motion.a href="https://linkedin.com/in/seu-perfil" target="_blank" whileHover={{ scale: 1.2, color: colors.blue }} style={{ color: 'white', fontSize: '1.8rem' }}><FaLinkedin /></motion.a>
              <motion.a href="https://instagram.com/seu-perfil" target="_blank" whileHover={{ scale: 1.2, color: colors.blue }} style={{ color: 'white', fontSize: '1.8rem' }}><FaInstagram /></motion.a>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <motion.div
                onClick={handleIntegrityClick}
                whileHover={{ scale: 1.05 }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '10px',
                  padding: '8px 15px', border: `1px solid ${integrityClicks > 0 ? '#ffb300' : 'rgba(0, 210, 255, 0.2)'}`,
                  borderRadius: '20px', cursor: 'pointer', transition: 'all 0.3s'
                }}
              >
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: integrityClicks > 0 ? '#ffb300' : colors.blue, boxShadow: `0 0 10px ${integrityClicks > 0 ? '#ffb300' : colors.blue}` }}
                />
                <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: integrityClicks > 0 ? '#ffb300' : colors.textGray, letterSpacing: '1px' }}>
                  {integrityClicks > 0 ? `SYS_REPAIR_IN_PROGRESS_${100 - (integrityClicks * 33)}%` : 'SYSTEM_STATUS: OPTIMAL'}
                </span>
              </motion.div>
            </div>

            <p style={{ fontSize: '0.8rem', color: colors.textGray }}>© 2025 UpixelStudios - Todos os direitos reservados.</p>
          </footer>
          {/*Não sei como faz pra desduplicar essa  de dinossauro*/}
          <AnimatePresence>
            {showDino && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,10,0,0.98)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <div style={{ background: '#05070a', padding: '30px', borderRadius: '10px', width: '90%', maxWidth: '700px', position: 'relative', border: `3px solid ${colors.terminalGreen}`, boxShadow: `0 0 30px ${colors.terminalGreen}66`, overflow: 'hidden' }}>
                  <button onClick={() => { setShowDino(false); setKeys(''); setIntegrityClicks(0); }} style={{ position: 'absolute', top: '10px', right: '15px', background: 'none', border: 'none', color: colors.terminalGreen, fontSize: '1rem', cursor: 'pointer', fontFamily: 'monospace', fontWeight: 'bold', zIndex: 10 }}>[ ESC ]</button>
                  <h2 style={{ color: colors.terminalGreen, textAlign: 'center', marginBottom: '30px', fontFamily: 'monospace', letterSpacing: '4px', textShadow: `0 0 10px ${colors.terminalGreen}` }}>IGOR_OS_RECREATION_PROTOCOL</h2>
                  <div style={{ filter: 'invert(100%) sepia(100%) saturate(500%) hue-rotate(70deg) brightness(90%) contrast(120%)', backgroundColor: '#fff', padding: '20px', borderRadius: '5px', boxShadow: `inset 0 0 50px rgba(0,255,0,0.2)` }}>
                    <ChromeDinoGame />
                  </div>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'repeating-linear-gradient(rgba(0,0,0,0) 0px, rgba(0,0,0,0) 1px, rgba(0, 255, 0, 0.05) 2px, rgba(0, 255, 0, 0.05) 3px)', pointerEvents: 'none', zIndex: 5 }} />
                  <p style={{ marginTop: '20px', color: colors.terminalGreen, fontSize: '0.7rem', textAlign: 'center', fontFamily: 'monospace', opacity: 0.8 }}>PRESS_SPACE_TO_START // RADS_LEVEL: 0</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


function App() {
  const colors = {
    dark: '#05070a',
    blue: '#00d2ff',
    purple: '#9d50bb',
    textGray: '#888888',
    terminalGreen: '#00ff00'
  };

  return (
    <Router>
      <motion.div
        key="global-scanlines"
        animate={{
          opacity: 0.4,
          background: `repeating-linear-gradient(rgba(0, 0, 0, 0) 0px, rgba(0, 0, 0, 0) 1px, ${colors.blue}33 2px, ${colors.blue}33 3px)`
        }}
        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10000 }}
      />

      <Routes>
        <Route path="/" element={<MainHome colors={colors} />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;