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

// Importação das páginas reais do seu CMS
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';

// --- FIREWALL DE ROTA (PROTECTED ROUTE) ---
const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Monitora o estado de login no Firebase
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

  // Redireciona para o login se tentar acessar o dashboard sem estar logado
  return user ? children : <Navigate to="/admin" />;
};

// --- COMPONENTE DA HOME PRINCIPAL (SEU MUNDO) ---
const MainHome = ({ colors }) => {
  const [showIntro, setShowIntro] = useState(true);
  const [displayedText, setDisplayedText] = useState("");
  const [showDino, setShowDino] = useState(false);
  const [keys, setKeys] = useState('');

  const phrases = [
    "Onde a precisão da Engenharia da Computação encontra a alma da narrativa autoral.",
    "Transformando cenários irreais em realidade.",
    "Interatividade que conecta.",
    "Transcendendo o óbvio para libertar visões originais."
  ];

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
            <motion.p 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              style={{ color: colors.blue, letterSpacing: '8px', textTransform: 'uppercase', fontSize: '0.9rem', marginBottom: '20px' }}
            >
              Iniciando Transmissão
            </motion.p>
            
            <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 5.5rem)', fontWeight: '900', lineHeight: '1.1', textTransform: 'uppercase', margin: 0 }}>
              BEM VINDO AO<br/>
              <span style={{ 
                background: `linear-gradient(to right, ${colors.blue}, ${colors.purple})`, 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent' 
              }}>MEU MUNDO.</span>
            </h1>

            <div style={{ minHeight: '1.5em', marginTop: '30px', fontSize: '1.5rem', color: colors.textGray }}>
              <span>{displayedText}</span>
              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.8, repeat: Infinity }} style={{ display: 'inline-block', width: '3px', height: '1em', backgroundColor: colors.blue, marginLeft: '5px', verticalAlign: 'middle' }} />
            </div>

            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })} style={{ marginTop: '60px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: colors.blue, letterSpacing: '3px', textTransform: 'uppercase' }}>Explorar Jornada</span>
              <div style={{ width: '1px', height: '40px', background: `linear-gradient(to bottom, ${colors.blue}, transparent)`, marginTop: '10px' }}></div>
            </motion.div>

            <div style={{ width: '100%', height: '350px', marginTop: '-180px', position: 'relative', zIndex: 2, cursor: 'grab' }}>
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
              <motion.a href="https://github.com/seu-perfil" target="_blank" whileHover={{ scale: 1.2, color: colors.blue }} style={{ color: 'white', fontSize: '1.8rem' }}><FaGithub /></motion.a>
              <motion.a href="https://linkedin.com/in/seu-perfil" target="_blank" whileHover={{ scale: 1.2, color: colors.blue }} style={{ color: 'white', fontSize: '1.8rem' }}><FaLinkedin /></motion.a>
              <motion.a href="https://instagram.com/seu-perfil" target="_blank" whileHover={{ scale: 1.2, color: colors.blue }} style={{ color: 'white', fontSize: '1.8rem' }}><FaInstagram /></motion.a>
            </div>
            <p style={{ fontSize: '0.8rem', color: colors.textGray }}>© 2025 UpixelStudios - Todos os direitos reservados.</p>
          </footer>

          <AnimatePresence>
            {showDino && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <div style={{ background: '#fff', padding: '30px', borderRadius: '15px', width: '90%', maxWidth: '600px', position: 'relative', boxShadow: `0 0 40px ${colors.blue}` }}>
                  <button onClick={() => { setShowDino(false); setKeys(''); }} style={{ position: 'absolute', top: '-45px', right: 0, background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer', fontWeight: 'bold' }}>FECHAR [X]</button>
                  <h2 style={{ color: '#000', textAlign: 'center', marginBottom: '20px', fontFamily: 'monospace' }}>DINO_MODE_ACTIVATED</h2>
                  <ChromeDinoGame />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- COMPONENTE APP ---
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
      {/* Scanlines Globais persistentes */}
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
        
        {/* Rota Protegida pelo Firewall */}
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