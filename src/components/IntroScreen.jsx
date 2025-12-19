import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const IntroScreen = ({ onComplete }) => {
  const [text, setText] = useState("");
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [logs, setLogs] = useState([]);
  
  const hasStarted = useRef(false);

  const fullMessage = "> INICIANDO CONEXÃO: BEM-VINDO AO IGOR_OS...";
  const bootLogs = [
    "> UPIXEL BIOS V3.0.2",
    "> CHECKING RAM... OK",
    "> INITIALIZING IGOR_OS_CORE",
    "> CONNECTING TO CLOUD_DATABASE...",
    "> LOADING MODULE: INTERACTIVE_PROJECT",
    "> STATUS: OPTIMAL"
  ];

  useEffect(() => {
    // DEBUG: Monitoramento de entrada
    console.log(">>> [1] TENTATIVA DE BOOT RECUPERADA.");

    if (hasStarted.current) {
      console.warn(">>> [!] BLOQUEIO EVITADO: AGUARDANDO RE-MONTAGEM.");
      return;
    }
    
    hasStarted.current = true;
    console.log(">>> [2] BOOT AUTORIZADO.");

    let i = 0;
    const typing = setInterval(() => {
      if (i <= fullMessage.length) {
        setText(fullMessage.slice(0, i));
        const currentProgress = (i / fullMessage.length) * 100;
        setProgress(currentProgress);
        i++;
      } else {
        clearInterval(typing);
        setIsReady(true);
        console.log(">>> [3] DIGITAÇÃO CONCLUÍDA.");
      }
    }, 50);

    const timers = bootLogs.map((log, index) => {
      return setTimeout(() => {
        console.log(`>>> [LOG] EXECUTANDO: ${log}`);
        setLogs(prev => {
          if (prev.includes(log)) return prev;
          return [...prev, log];
        });
      }, index * 400);
    });

    // O SEGREDO ESTÁ AQUI: No cleanup, resetamos a trava para a próxima montagem
    return () => {
      console.log(">>> [4] CLEANUP: RESETANDO TRAVA DE SEGURANÇA.");
      clearInterval(typing);
      timers.forEach(t => clearTimeout(t));
      hasStarted.current = false; // Permite que a montagem final do React 18 execute o código
    };
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.scanlines} />
      <div style={styles.mainScreen}>
        <div style={styles.logContainer}>
          {logs.map((log, index) => (
            <motion.p initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} key={index} style={styles.terminalTextSmall}>
              {log}
            </motion.p>
          ))}
        </div>

        <div style={styles.centerContent}>
          <div style={styles.messageBox}>
            {text}
            {!isReady && (
              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.8, repeat: Infinity }} style={styles.cursor} />
            )}
          </div>

          <div style={styles.progressContainer}>
            <div style={styles.progressLabel}>BOOT_SEQUENCE: {Math.round(progress)}%</div>
            <div style={styles.progressBarBg}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} style={styles.progressBarFill} />
            </div>
          </div>

          <div style={{ height: '60px', marginTop: '30px' }}>
            <AnimatePresence>
              {isReady && (
                <motion.button
                  key="btn-enter"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ backgroundColor: '#1aff80', color: '#000' }}
                  onClick={onComplete}
                  style={styles.actionBtn}
                >
                  [ EXECUTAR_AUTORIZACAO ]
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div style={styles.terminalFooter}>
          <span>HP 100/100</span><span>IGOR_OS V.1.0</span><span>RADS 0</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { backgroundColor: '#05070a', height: '100vh', width: '100vw', padding: '20px', fontFamily: '"Courier New", Courier, monospace', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  scanlines: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)', backgroundSize: '100% 4px', pointerEvents: 'none', zIndex: 10 },
  mainScreen: { border: '2px solid #1aff80', width: '100%', maxWidth: '900px', height: '80vh', padding: '40px', backgroundColor: 'rgba(26, 255, 128, 0.05)', borderRadius: '10px', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 5 },
  logContainer: { position: 'absolute', top: '20px', left: '20px' },
  terminalTextSmall: { color: '#1aff80', fontSize: '0.8rem', margin: '2px 0', opacity: 0.7 },
  centerContent: { textAlign: 'center', width: '100%', maxWidth: '500px' },
  messageBox: { fontSize: '1.2rem', color: '#1aff80', marginBottom: '30px', minHeight: '1.5em', textShadow: '0 0 5px #1aff80' },
  cursor: { display: 'inline-block', width: '10px', height: '1.2em', backgroundColor: '#1aff80', marginLeft: '5px', verticalAlign: 'middle' },
  progressContainer: { width: '100%', marginBottom: '20px' },
  progressLabel: { color: '#1aff80', fontSize: '0.7rem', marginBottom: '8px', textAlign: 'left' },
  progressBarBg: { width: '100%', height: '12px', border: '1px solid #1aff80', padding: '2px' },
  progressBarFill: { height: '100%', backgroundColor: '#1aff80', boxShadow: '0 0 10px #1aff80' },
  actionBtn: { background: 'transparent', color: '#1aff80', border: '1px solid #1aff80', padding: '12px 30px', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'inherit', letterSpacing: '2px' },
  terminalFooter: { position: 'absolute', bottom: '20px', width: 'calc(100% - 40px)', display: 'flex', justifyContent: 'space-between', color: '#1aff80', fontSize: '0.8rem', opacity: 0.5, borderTop: '1px solid rgba(26, 255, 128, 0.2)', paddingTop: '10px' }
};

export default IntroScreen;