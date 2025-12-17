import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const IntroScreen = ({ onComplete }) => {
  const [text, setText] = useState("");
  const fullMessage = "> SYSTEM BOOT: IGOR_OS_2025... ACCESS GRANTED.";

  useEffect(() => {
    let i = 0;
    const typing = setInterval(() => {
      setText(fullMessage.slice(0, i + 1));
      i++;
      if (i === fullMessage.length) {
        clearInterval(typing);
        setTimeout(onComplete, 1000); // Libera o site após 1s de finalizar
      }
    }, 50);

    // Timer de segurança: força a entrada após 6 segundos se algo travar
    const securityTimeout = setTimeout(onComplete, 6000);

    return () => {
      clearInterval(typing);
      clearTimeout(securityTimeout);
    };
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: '#000', display: 'flex', justifyContent: 'center',
      alignItems: 'center', zIndex: 9999, color: '#00ff00', fontFamily: 'monospace'
    }}>
      <div style={{ fontSize: '1.5rem', textAlign: 'center', padding: '0 20px' }}>
        {text}
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          style={{ display: 'inline-block', width: '10px', height: '1em', backgroundColor: '#00ff00', marginLeft: '5px', verticalAlign: 'middle' }}
        />
      </div>

      {/* Efeito de Scanlines (TV Antiga/PS2) */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
        backgroundSize: '100% 4px, 3px 100%', pointerEvents: 'none', opacity: 0.3
      }} />
    </div>
  );
};

export default IntroScreen;