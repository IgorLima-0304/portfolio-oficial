import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { auth } from '../firebase'; 
import { signInWithEmailAndPassword } from 'firebase/auth'; 

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaChallenge, setCaptchaChallenge] = useState({ a: 0, b: 0 });
  const [userCaptchaAnswer, setUserCaptchaAnswer] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Cores Pip-Boy
  const amber = '#1aff80';

  const generateCaptcha = () => {
    setCaptchaChallenge({
      a: Math.floor(Math.random() * 10) + 1,
      b: Math.floor(Math.random() * 10) + 1
    });
    setUserCaptchaAnswer('');
  };

  useEffect(() => { generateCaptcha(); }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (parseInt(userCaptchaAnswer) !== captchaChallenge.a + captchaChallenge.b) {
      setError(">>> ERRO: VERIFICAÇÃO BIOMÉTRICA FALHOU. HUMANO NÃO DETECTADO.");
      generateCaptcha();
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(">>> ACESSO NEGADO: CREDENCIAIS INVÁLIDAS NO DATABASE.");
      generateCaptcha();
    }
  };

  return (
    <div style={styles.container}>
      {/* Efeito de Scanlines*/}
      <div style={styles.scanlines} />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        style={styles.terminalWindow}
      >
        {/* vai tomano do pipboy */}
        <div style={styles.header}>
          <span style={styles.activeTab}>LOG_IN</span>
          <span style={styles.tab}>RECOVERY</span>
          <span style={styles.tab}>ENCRYPT</span>
        </div>

        <h2 style={styles.title}> IDENTIDADE_REQUERIDA_VAULT_TEC</h2>
        
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputWrapper}>
            <label style={styles.label}>USER_ID:</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              style={styles.input} 
              required 
            />
          </div>
          
          <div style={styles.inputWrapper}>
            <label style={styles.label}>PASS_KEY:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              style={styles.input} 
              required 
            />
          </div>

          {/* soma aí bot */}
          <div style={styles.captchaBox}>
            <p style={styles.captchaText}>
              // TESTE_DE_VOIGHT-KAMPFF: {captchaChallenge.a} + {captchaChallenge.b} = ?
            </p>
            <input 
              type="number" 
              value={userCaptchaAnswer} 
              onChange={(e) => setUserCaptchaAnswer(e.target.value)}
              style={styles.captchaInput} 
              placeholder="???"
              required
            />
          </div>

          <button type="submit" style={styles.submitBtn}>
            [ EXECUTAR_AUTENTICAÇÃO ]
          </button>
        </form>

        {error && (
          <motion.p 
            initial={{ x: -10 }} 
            animate={{ x: 0 }} 
            style={styles.errorText}
          >
            {error}
          </motion.p>
        )}
      </motion.div>

      <footer style={styles.footer}>
        <span>VAULT-TEC OS V.2.5.0</span>
        <span>STABLE_CONNECTION</span>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#05070a',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: '"Courier New", Courier, monospace',
    position: 'relative',
    overflow: 'hidden',
    color: '#1aff80',
    textShadow: '0 0 5px #1aff80',
  },
  scanlines: {
    position: 'absolute',
    top: 0, left: 0, width: '100%', height: '100%',
    background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
    backgroundSize: '100% 4px, 3px 100%',
    pointerEvents: 'none',
    zIndex: 10,
  },
  terminalWindow: {
    width: '90%',
    maxWidth: '450px',
    padding: '40px',
    border: '2px solid #1aff80',
    background: 'rgba(26, 255, 128, 0.03)',
    borderRadius: '10px',
    zIndex: 5,
    boxShadow: 'inset 0 0 20px rgba(26, 255, 128, 0.1)',
  },
  header: {
    display: 'flex',
    gap: '20px',
    marginBottom: '30px',
    borderBottom: '1px solid #1aff80',
    paddingBottom: '10px',
    fontSize: '0.9rem',
    fontWeight: 'bold'
  },
  activeTab: { borderBottom: '3px solid #1aff80', paddingBottom: '7px' },
  tab: { opacity: 0.4 },
  title: { fontSize: '1.1rem', marginBottom: '25px', letterSpacing: '2px' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputWrapper: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '0.8rem', fontWeight: 'bold' },
  input: {
    background: 'rgba(0,0,0,0.6)',
    border: '1px solid #1aff80',
    color: '#1aff80',
    padding: '12px',
    outline: 'none',
    fontFamily: 'inherit'
  },
  captchaBox: {
    border: '1px dashed #1aff80',
    padding: '15px',
    marginTop: '10px',
    background: 'rgba(26, 255, 128, 0.05)'
  },
  captchaText: { fontSize: '0.75rem', marginBottom: '10px' },
  captchaInput: {
    background: 'transparent',
    borderBottom: '2px solid #1aff80',
    borderTop: 'none', borderLeft: 'none', borderRight: 'none',
    color: '#1aff80',
    padding: '5px',
    width: '60px',
    textAlign: 'center',
    outline: 'none',
    fontFamily: 'inherit'
  },
  submitBtn: {
    backgroundColor: '#1aff80',
    color: '#000',
    border: 'none',
    padding: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '1rem',
    marginTop: '10px',
    transition: 'all 0.2s',
  },
  errorText: { color: '#ff4d4d', marginTop: '20px', fontSize: '0.8rem', textShadow: '0 0 5px #ff4d4d' },
  footer: {
    marginTop: '30px',
    width: '100%',
    maxWidth: '450px',
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.7rem',
    opacity: 0.6
  }
};

export default AdminLogin;