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

  // Gera um novo desafio matemático
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

    // Validação do Captcha antes de consultar o Firebase
    if (parseInt(userCaptchaAnswer) !== captchaChallenge.a + captchaChallenge.b) {
      setError("ERRO: CAPTCHA INCORRETO. VOCÊ É UM BOT?");
      generateCaptcha();
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError("ACESSO NEGADO: CREDENCIAIS INVÁLIDAS");
      generateCaptcha();
    }
  };

  return (
    <div style={{ backgroundColor: '#05070a', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'monospace' }}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ padding: '40px', border: '1px solid #00ff00', background: 'rgba(0,255,0,0.02)' }}>
        <h2 style={{ color: '#00ff00' }}> IDENTIDADE_REQUERIDA</h2>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
          <input type="email" placeholder="USUÁRIO" value={email} onChange={(e) => setEmail(e.target.value)} 
            style={{ background: 'transparent', border: '1px solid #00ff00', color: '#00ff00', padding: '10px', outline: 'none' }} required />
          
          <input type="password" placeholder="SENHA" value={password} onChange={(e) => setPassword(e.target.value)} 
            style={{ background: 'transparent', border: '1px solid #00ff00', color: '#00ff00', padding: '10px', outline: 'none' }} required />

          {/* ÁREA DO CAPTCHA */}
          <div style={{ border: '1px dashed #00ff00', padding: '10px', marginTop: '5px' }}>
            <p style={{ color: '#00ff00', fontSize: '0.8rem', marginBottom: '10px' }}>
              PROVE QUE É HUMANO: {captchaChallenge.a} + {captchaChallenge.b} = ?
            </p>
            <input 
              type="number" 
              placeholder="RESULTADO" 
              value={userCaptchaAnswer} 
              onChange={(e) => setUserCaptchaAnswer(e.target.value)}
              style={{ background: 'transparent', border: '1px solid #00ff00', color: '#00ff00', padding: '8px', width: '100px' }} 
              required
            />
          </div>

          <button type="submit" style={{ backgroundColor: '#00ff00', color: '#000', border: 'none', padding: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
            EXECUTAR_LOGIN
          </button>
        </form>
        {error && <p style={{ color: '#ff0000', marginTop: '15px', fontSize: '0.8rem' }}>{error}</p>}
      </motion.div>
    </div>
  );
};

export default AdminLogin;