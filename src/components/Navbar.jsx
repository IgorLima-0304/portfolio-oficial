import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const colors = {
    blue: '#00d2ff',
    purple: '#9d50bb',
  };

  const menuItems = [
    { label: 'Início', id: 'home', type: 'scroll' },
    { label: 'Sobre Mim', id: 'about', type: 'scroll' },
    { label: 'Habilidades', id: 'skills', type: 'scroll' },
    { label: 'Projetos', id: 'services', type: 'scroll' },
    { label: 'Blog', id: '/blog', type: 'link' },
    { label: 'Contato', id: 'contact', type: 'scroll' },
  ];

  const handleNavigation = (e, item) => {
    e.preventDefault();
    if (item.type === 'link') {
      navigate(item.id);
    } else {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const element = document.getElementById(item.id);
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        if (item.id === 'home') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const element = document.getElementById(item.id);
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <nav style={styles.navContainer}>
      {/* 1. LOGO */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={styles.logoArea}
        onClick={(e) => handleNavigation(e, { id: 'home', type: 'scroll' })}
      >
        <span style={styles.prompt}>&gt;</span> 
        <span style={styles.logoText}>IGOR_OS</span>
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
          style={styles.terminalCursor}
        />
      </motion.div>

      {/* 2. MENU CENTRALIZADO COM MARGIN AUTO */}
      <div style={styles.menuLinks}>
        {menuItems.map((item) => (
          <motion.a
            key={item.label}
            href={item.id}
            onClick={(e) => handleNavigation(e, item)}
            whileHover={{ scale: 1.1, color: colors.blue }}
            whileTap={{ scale: 0.9 }}
            style={{ 
              ...styles.link,
              color: item.label === 'Blog' ? colors.blue : 'white',
              textShadow: item.label === 'Blog' ? `0 0 10px ${colors.blue}` : 'none'
            }}
          >
            {item.label}
          </motion.a>
        ))}
      </div>

      {/* 3. ESPAÇADOR PARA MANTER O EQUILÍBRIO NA LOGO */}
      <div style={styles.rightSpacer} />
    </nav>
  );
};

const styles = {
  navContainer: {
    position: 'fixed', 
    top: 0, 
    width: '100%', 
    display: 'flex', 
    alignItems: 'center', 
    padding: '15px 40px', 
    boxSizing: 'border-box', 
    backdropFilter: 'blur(15px)',
    backgroundColor: 'rgba(5, 7, 10, 0.8)', 
    zIndex: 1000, 
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    flexWrap: 'wrap' // Permite adaptação em telas muito pequenas
  },
  logoArea: { 
    display: 'flex', 
    alignItems: 'center', 
    fontSize: '1.2rem', 
    fontFamily: "'Fira Code', monospace", 
    fontWeight: 'bold', 
    cursor: 'pointer',
    flexShrink: 0 // Impede que a logo seja esmagada
  },
  prompt: { color: '#00d2ff', marginRight: '5px', textShadow: '0 0 8px #00d2ff' },
  logoText: { 
    background: 'linear-gradient(to right, #00d2ff, #9d50bb)', 
    WebkitBackgroundClip: 'text', 
    WebkitTextFillColor: 'transparent', 
    filter: 'drop-shadow(0 0 5px #00d2ff)' 
  },
  terminalCursor: { width: '10px', height: '1.2em', backgroundColor: '#00d2ff', marginLeft: '4px', boxShadow: '0 0 10px #00d2ff' },
  menuLinks: { 
    display: 'flex', 
    gap: 'clamp(10px, 2vw, 35px)', 
    fontSize: '0.75rem', 
    textTransform: 'uppercase', 
    fontWeight: '500', 
    letterSpacing: '1.5px',
    margin: '0 auto', // MÁGICA: Empurra os irmãos e centraliza o menu
    padding: '0 20px'
  },
  link: { textDecoration: 'none', transition: 'all 0.3s ease', cursor: 'pointer', whiteSpace: 'nowrap' },
  rightSpacer: { 
    width: '120px', // Aproximadamente o tamanho da logo para equilibrar
    display: 'block' 
  }
};

export default Navbar;