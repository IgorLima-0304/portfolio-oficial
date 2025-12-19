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
    { label: 'Contato', id: 'contact' },
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
      display: 'grid', // Mudamos para grid para controle absoluto das áreas
      gridTemplateColumns: '1fr auto 1fr', // 3 colunas: Logo (flex), Menu (centro), Espaço (flex)
      alignItems: 'center',
      padding: '20px 50px',
      boxSizing: 'border-box',
      backdropFilter: 'blur(10px)',
      backgroundColor: 'rgba(5, 7, 10, 0.8)',
      zIndex: 1000,
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      
      {/* 1. ÁREA DA LOGO (Alinhada à esquerda) */}
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
          justifySelf: 'start' // Garante que a logo fique na ponta esquerda
        }}
        onClick={(e) => scrollToSection(e, 'home')}
      >
        <span style={{ color: colors.blue, marginRight: '5px', textShadow: `0 0 8px ${colors.blue}` }}>&gt;</span> 
        <span style={{ 
          background: `linear-gradient(to right, ${colors.blue}, ${colors.purple})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: `drop-shadow(0 0 5px ${colors.blue})`
        }}>
          IGOR_OS
        </span>
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "steps(2)" }}
          style={{ width: '10px', height: '1.2em', backgroundColor: colors.blue, marginLeft: '4px', boxShadow: `0 0 10px ${colors.blue}` }}
        />
      </motion.div>

      {/* 2. ÁREA DO MENU (Centralizada) */}
      <div style={{ 
        display: 'flex', 
        gap: '40px', 
        fontSize: '0.8rem', 
        textTransform: 'uppercase', 
        fontWeight: '500',
        letterSpacing: '1px',
        justifySelf: 'center' // Mágica do Grid: centraliza perfeitamente o bloco
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

      {/* 3. ESPAÇO VAZIO (Para equilibrar o grid) */}
      <div style={{ justifySelf: 'end', width: '150px' }}>
        {/* Este div está vazio apenas para empurrar o menu para o centro real */}
      </div>
    </nav>
  );
};

export default Navbar;