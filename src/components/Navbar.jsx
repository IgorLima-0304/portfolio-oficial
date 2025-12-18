import React from 'react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const colors = {
    blue: '#00d2ff',
    purple: '#9d50bb',
  };

  const menuItems = [
    { label: 'Início', id: 'home' },
    { label: 'Sobre Mim', id: 'about' },
    { label: 'Habilidades', id: 'skills' },
    { label: 'Projetos', id: 'services' },
  ];

  const scrollToSection = (e, id) => {
    e.preventDefault();
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
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
      {/* LOGO IGOR_OS COM AS CORES DA TELA PRINCIPAL */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ 
          display: 'flex',
          alignItems: 'center',
          fontSize: '1.2rem', 
          fontFamily: "'Fira Code', monospace", 
          fontWeight: 'bold', 
          cursor: 'pointer',
        }}
        onClick={(e) => scrollToSection(e, 'home')}
      >
        <span style={{ color: colors.blue, marginRight: '5px', textShadow: `0 0 8px ${colors.blue}` }}>&gt;</span> 
        
        <span style={{ 
          background: `linear-gradient(to right, ${colors.blue}, ${colors.purple})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: `drop-shadow(0 0 5px ${colors.blue})` // Efeito Neon
        }}>
          IGOR_OS
        </span>

        {/* Cursor piscante combinando com o azul neon */}
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "steps(2)" }}
          style={{ 
            width: '10px', 
            height: '1.2em', 
            backgroundColor: colors.blue, 
            marginLeft: '4px',
            boxShadow: `0 0 10px ${colors.blue}`
          }}
        />
      </motion.div>

      {/* Links do Menu */}
      <div style={{ 
        display: 'flex', 
        gap: '30px', 
        fontSize: '0.8rem', 
        textTransform: 'uppercase', 
        fontWeight: '500',
        letterSpacing: '1px'
      }}>
        {menuItems.map((item) => (
          <motion.a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => scrollToSection(e, item.id)}
            whileHover={{ scale: 1.1, color: colors.blue }}
            whileTap={{ scale: 0.9 }}
            style={{ 
              color: 'white', 
              textDecoration: 'none', 
              transition: 'color 0.3s ease',
              cursor: 'pointer'
            }}
          >
            {item.label}
          </motion.a>
        ))}
      </div>

      {/* Botão de Contato */}
      <motion.button 
        onClick={(e) => scrollToSection(e, 'contact')}
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
        Contato
      </motion.button>
    </nav>
  );
};

export default Navbar;