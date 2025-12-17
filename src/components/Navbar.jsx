import React from 'react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const colors = {
    blue: '#00d2ff',
    purple: '#9d50bb',
  };

  // Função para scroll suave manual (opcional, pois o CSS resolve 90%)
  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 50px',
      boxSizing: 'border-box',
      backdropFilter: 'blur(10px)',
      backgroundColor: 'rgba(5, 7, 10, 0.8)',
      zIndex: 1000,
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      {/* Logo com animação de entrada */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold', 
          color: colors.blue,
          letterSpacing: '2px' 
        }}>
        IS
      </motion.div>

      {/* Links do Menu Animados */}
      <div style={{ 
        display: 'flex', 
        gap: '30px', 
        fontSize: '0.8rem', 
        textTransform: 'uppercase', 
        fontWeight: '500',
        letterSpacing: '1px'
      }}>
        {['home', 'about', 'skills', 'services'].map((item) => (
          <motion.a
            key={item}
            href={`#${item}`}
            onClick={(e) => scrollToSection(e, item)}
            whileHover={{ scale: 1.1, color: colors.blue }}
            whileTap={{ scale: 0.9 }}
            style={{ 
              color: 'white', 
              textDecoration: 'none', 
              transition: 'color 0.3s ease' 
            }}
          >
            {item === 'home' ? 'Home' : item === 'about' ? 'About Me' : item.charAt(0).toUpperCase() + item.slice(1)}
          </motion.a>
        ))}
      </div>

      {/* Botão de Contato com efeito de pulsação */}
      <motion.button 
        whileHover={{ scale: 1.05, boxShadow: `0 0 15px ${colors.blue}` }}
        whileTap={{ scale: 0.95 }}
        style={{
          background: `linear-gradient(to right, ${colors.blue}, ${colors.purple})`,
          color: 'white',
          border: 'none',
          padding: '10px 25px',
          borderRadius: '6px',
          fontWeight: 'bold',
          cursor: 'pointer',
          fontSize: '0.8rem',
          textTransform: 'uppercase'
        }}>
        Contact
      </motion.button>
    </nav>
  );
};

export default Navbar;