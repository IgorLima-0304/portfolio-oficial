import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const IntroScreen = ({ onComplete }) => {
  const [text, setText] = useState("");
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  
  const fullMessage = "> INICIANDO CONEXÃO: BEM-VINDO AO MEU MUNDO...";

  useEffect(() => {
    let i = 0;
    // Ajuste na velocidade: um pouco mais rápido para não cansar o usuário
    const typing = setInterval(() => {
      if (i <= fullMessage.length) {
        setText(fullMessage.slice(0, i));
        const currentProgress = (i / fullMessage.length) * 100;
        setProgress(currentProgress);
        i++;
      } else {
        clearInterval(typing);
        setIsReady(true); // FINALIZAÇÃO SEGURA: Mostra o botão
      }
    }, 50);

    return () => clearInterval(typing);
  }, []);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: '#000', display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center', zIndex: 9999, 
      color: '#00ff00', fontFamily: 'monospace', overflow: 'hidden'
    }}>
      
      {/* Container de Texto com Altura Fixa para evitar que o layout pule */}
      <div style={{ 
        height: '40px',
        fontSize: '1.1rem', 
        textAlign: 'center', 
        padding: '0 20px', 
        marginBottom: '20px',
        textShadow: '0 0 8px rgba(0, 255, 0, 0.6)'
      }}>
        {text}
        {!isReady && (
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            style={{ display: 'inline-block', width: '8px', height: '1em', backgroundColor: '#00ff00', marginLeft: '5px', verticalAlign: 'middle' }}
          />
        )}
      </div>

      {/* Barra de Progresso */}
      <div style={{
        width: '280px',
        height: '18px',
        border: '2px solid #00ff00',
        padding: '2px',
        backgroundColor: 'rgba(0, 255, 0, 0.05)',
        position: 'relative',
        marginBottom: '40px'
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          style={{
            height: '100%',
            backgroundColor: '#00ff00',
            backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.1) 50%, transparent 50%)`,
            backgroundSize: '10px 100%', 
            boxShadow: '0 0 10px rgba(0, 255, 0, 0.5)'
          }}
        />
      </div>

      {/* Controle de Entrada */}
      <div style={{ height: '60px' }}>
        <AnimatePresence>
          {isReady ? (
            <motion.button
              key="btn-enter"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ backgroundColor: '#00ff00', color: '#000', scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onComplete} // ESSENCIAL: Dispara o som no App.jsx
              style={{
                padding: '12px 40px',
                backgroundColor: 'transparent',
                border: '2px solid #00ff00',
                color: '#00ff00',
                cursor: 'pointer',
                fontFamily: 'monospace',
                fontWeight: 'bold',
                letterSpacing: '2px',
                textTransform: 'uppercase'
              }}
            >
              ENTRAR NO SISTEMA
            </motion.button>
          ) : (
            <motion.p 
              key="txt-load"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{ fontSize: '0.8rem', letterSpacing: '2px', color: '#00ff00' }}
            >
              CARREGANDO_CORE... {Math.round(progress)}%
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Scanlines Decorativas */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        background: 'repeating-linear-gradient(rgba(0,0,0,0) 0px, rgba(0,0,0,0) 1px, rgba(0, 255, 0, 0.03) 2px, rgba(0, 255, 0, 0.03) 3px)',
        backgroundSize: '100% 4px', pointerEvents: 'none'
      }} />
    </div>
  );
};

export default IntroScreen;