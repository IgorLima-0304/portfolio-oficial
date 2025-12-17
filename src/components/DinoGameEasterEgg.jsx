import React, { useState, useEffect } from 'react';
import ChromeDinoGame from 'react-chrome-dino';
import { motion, AnimatePresence } from 'framer-motion';

const DinoGameEasterEgg = () => {
  const [showGame, setShowGame] = useState(false);
  // Sequência de teclas para ativar o easter egg (ex: "dino")
  const KONAMI_CODE = ['d', 'i', 'n', 'o']; 
  const [pressedKeys, setPressedKeys] = useState([]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      const newPressedKeys = [...pressedKeys, event.key.toLowerCase()];
      setPressedKeys(newPressedKeys.slice(-KONAMI_CODE.length)); // Mantém apenas as últimas N teclas

      if (newPressedKeys.slice(-KONAMI_CODE.length).join('') === KONAMI_CODE.join('')) {
        setShowGame(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [pressedKeys]); // Adicione pressedKeys como dependência

  const handleCloseGame = () => {
    setShowGame(false);
    setPressedKeys([]); // Reseta as teclas para que o jogo possa ser ativado novamente
  };

  return (
    <AnimatePresence>
      {showGame && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 99999, // Acima de tudo!
            border: '5px solid #00d2ff',
            boxShadow: '0 0 30px #00d2ff',
            borderRadius: '10px',
            backgroundColor: 'black',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '10px'
          }}
        >
          <h3 style={{color: '#00d2ff', marginBottom: '10px'}}>DINO MODE ACTIVATED!</h3>
          <ChromeDinoGame style={{ width: '600px', height: '150px' }} />
          <motion.button
            onClick={handleCloseGame}
            whileHover={{ scale: 1.05, boxShadow: '0 0 15px #9d50bb' }}
            whileTap={{ scale: 0.95 }}
            style={{
              marginTop: '15px',
              padding: '8px 20px',
              background: 'linear-gradient(to right, #00d2ff, #9d50bb)',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            CLOSE
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DinoGameEasterEgg;