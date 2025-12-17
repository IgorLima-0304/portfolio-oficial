import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AboutMe from './components/AboutMe';
import Skills from './components/Skills';
import Services from './components/Services';
import IntroScreen from './components/IntroScreen';
import ChromeDinoGame from 'react-chrome-dino';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import Contact from './components/Contact';

function App() {
  // Configuração de Cores Neon
  const colors = {
    dark: '#05070a',
    blue: '#00d2ff',
    purple: '#9d50bb',
    textGray: '#888888'
  };

  // Estados do Sistema
  const [showIntro, setShowIntro] = useState(true);
  const [showDino, setShowDino] = useState(false);
  const [keys, setKeys] = useState('');
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "Software Developer";

  // 1. Lógica de digitação (Inicia após o BOOT da Intro)
  useEffect(() => {
    if (!showIntro) {
      let i = 0;
      const timer = setInterval(() => {
        setDisplayedText(fullText.slice(0, i + 1));
        i++;
        if (i === fullText.length) clearInterval(timer);
      }, 100);
      return () => clearInterval(timer);
    }
  }, [showIntro]);

  // 2. Lógica do Easter Egg (Detecta a sequência "dino")
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showDino) return; // Evita duplicar lógica se o jogo estiver aberto
      const newKeys = (keys + e.key).toLowerCase().slice(-4);
      setKeys(newKeys);
      if (newKeys === 'dino') {
        setShowDino(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keys, showDino]);

  return (
    <AnimatePresence mode="wait">
      {showIntro ? (
        // TELA DE INTRODUÇÃO (BOOT SYSTEM ESTILO PS2)
        <IntroScreen key="intro" onComplete={() => setShowIntro(false)} />
      ) : (
        // CONTEÚDO PRINCIPAL DO PORTFÓLIO
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
            margin: 0,
            padding: 0,
            overflowX: 'hidden'
          }}
        >
          <Navbar />

          {/* SEÇÃO HERO / CABEÇALHO */}
          <header style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '100vh',
            textAlign: 'center',
            padding: '0 20px'
          }}>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              style={{ fontSize: '1.2rem', color: colors.textGray, letterSpacing: '5px', marginBottom: '10px', textTransform: 'uppercase' }}
            >
              I'm a
            </motion.p>

            <h1 style={{ 
              fontSize: 'clamp(2.5rem, 8vw, 6rem)', 
              fontWeight: '900', 
              lineHeight: '1.1', 
              textTransform: 'uppercase',
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                Full Stack
              </motion.div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '1.2em' }}>
                <span style={{ 
                  background: `linear-gradient(to right, ${colors.blue}, ${colors.purple})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  {displayedText}
                </span>

                {/* Cursor Animado Dinâmico */}
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  style={{ 
                    display: 'inline-block',
                    width: '12px', 
                    height: '0.8em', 
                    backgroundColor: colors.blue, 
                    marginLeft: '8px',
                    boxShadow: `0 0 10px ${colors.blue}`,
                    verticalAlign: 'middle'
                  }}
                />
              </div>
            </h1>

            <motion.button 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                marginTop: '40px',
                padding: '15px 35px',
                border: 'none',
                borderRadius: '8px',
                background: `linear-gradient(to right, ${colors.blue}, ${colors.purple})`,
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                cursor: 'pointer',
                boxShadow: `0 0 25px rgba(0, 210, 255, 0.3)`,
                textTransform: 'uppercase'
              }}
            >
              Previous Projects
            </motion.button>
          </header>

          {/* COMPONENTES DE SEÇÃO */}
          <AboutMe />
          <Skills />
          <Services />
          <Contact />

          {/* FOOTER COM REDES SOCIAIS */}
          <footer style={{ 
            padding: '60px 40px', 
            textAlign: 'center', 
            borderTop: '1px solid rgba(255,255,255,0.05)',
            backgroundColor: colors.dark 
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '30px' }}>
              <motion.a 
                href="https://github.com/SEU_USUARIO" 
                target="_blank" rel="noopener noreferrer"
                whileHover={{ scale: 1.2, color: colors.blue }}
                style={{ color: 'white', fontSize: '1.8rem', transition: '0.3s' }}
              >
                <FaGithub />
              </motion.a>

              <motion.a 
                href="https://linkedin.com/in/SEU_USUARIO" 
                target="_blank" rel="noopener noreferrer"
                whileHover={{ scale: 1.2, color: colors.blue }}
                style={{ color: 'white', fontSize: '1.8rem', transition: '0.3s' }}
              >
                <FaLinkedin />
              </motion.a>

              <motion.a 
                href="https://instagram.com/SEU_USUARIO" 
                target="_blank" rel="noopener noreferrer"
                whileHover={{ scale: 1.2, color: colors.blue }}
                style={{ color: 'white', fontSize: '1.8rem', transition: '0.3s' }}
              >
                <FaInstagram />
              </motion.a>
            </div>
            <p style={{ fontSize: '0.8rem', color: colors.textGray, margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>
              © 2025 Igor - Todos os direitos reservados.
            </p>
          </footer>

          {/* MODAL DO JOGO DO DINOSSAURO (EASTER EGG) */}
          <AnimatePresence>
            {showDino && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                style={{
                  position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                  backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 99999,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                }}
              >
                <div style={{ 
                  background: '#fff', padding: '30px', borderRadius: '15px', 
                  position: 'relative', width: '90%', maxWidth: '600px',
                  boxShadow: `0 0 40px ${colors.blue}`
                }}>
                  <button 
                    onClick={() => { setShowDino(false); setKeys(''); }}
                    style={{ 
                      position: 'absolute', top: '-45px', right: 0, background: 'none', 
                      border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer', fontWeight: 'bold' 
                    }}
                  >
                    FECHAR [X]
                  </button>
                  <h2 style={{ color: '#000', textAlign: 'center', marginBottom: '20px', fontFamily: 'monospace' }}>
                    DINO_MODE_ACTIVATED
                  </h2>
                  <ChromeDinoGame />
                  <p style={{ color: '#666', fontSize: '0.8rem', textAlign: 'center', marginTop: '15px' }}>
                    Aperte ESPAÇO para pular!
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;