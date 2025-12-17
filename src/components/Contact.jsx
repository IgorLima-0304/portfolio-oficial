import React from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
  const colors = {
    blue: '#00d2ff',
    purple: '#9d50bb',
  };

  return (
    <section id="contact" style={{ padding: '100px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', marginBottom: '40px' }}
      >
        <h2 style={{ fontSize: '2.5rem', textTransform: 'uppercase', letterSpacing: '4px' }}>
          Entre em <span style={{ color: colors.blue }}>Contato</span>
        </h2>
        <p style={{ color: '#888', marginTop: '10px' }}>
          Fale comigo!
        </p>
      </motion.div>

      <motion.form 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        action="https://formspree.io/f/SEU_ID_AQUI" // Substitua pelo seu ID do Formspree
        method="POST"
        style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
      >
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <input 
            type="text" name="name" placeholder="Seu Nome" required
            style={inputStyle}
          />
          <input 
            type="email" name="email" placeholder="Seu E-mail" required
            style={inputStyle}
          />
        </div>
        <textarea 
          name="message" placeholder="Sua Mensagem ou História" rows="5" required
          style={inputStyle}
        ></textarea>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: `0 0 20px ${colors.blue}` }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          style={{
            padding: '15px',
            border: 'none',
            borderRadius: '8px',
            background: `linear-gradient(to right, ${colors.blue}, ${colors.purple})`,
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer',
            textTransform: 'uppercase'
          }}
        >
          Enviar Mensagem
        </motion.button>
      </motion.form>
    </section>
  );
};

const inputStyle = {
  flex: 1,
  padding: '15px',
  borderRadius: '8px',
  border: '1px solid rgba(255,255,255,0.1)',
  backgroundColor: 'rgba(255,255,255,0.05)',
  color: 'white',
  outline: 'none',
  fontSize: '1rem',
  minWidth: '280px'
};

export default Contact;