import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaGamepad, FaCode, FaLaptopCode } from "react-icons/fa";

// 1. O card individual
const ServiceCard = ({ title, description, icon: Icon, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const colors = { blue: '#00d2ff', purple: '#9d50bb' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        boxShadow: isHovered 
          ? [`0px 0px 0px ${colors.blue}`, `0px 0px 20px ${colors.blue}`, `0px 0px 40px ${colors.purple}`, `0px 0px 0px ${colors.blue}`] 
          : "0px 0px 0px rgba(0,0,0,0)",
        scale: isHovered ? 1.05 : 1
      }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        scale: { duration: 0.3 },
        boxShadow: { duration: 2, repeat: Infinity, ease: "linear" }
      }}
      style={{
        padding: '1.5px',
        borderRadius: '20px',
        background: isHovered ? `linear-gradient(135deg, ${colors.blue}, ${colors.purple})` : 'transparent',
        cursor: 'pointer',
        height: '100%',
      }}
    >
      <div style={{
        backgroundColor: '#0a0c10',
        borderRadius: '19px',
        padding: '30px',
        height: '250px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        boxSizing: 'border-box'
      }}>
        <div style={{ fontSize: '2.5rem', color: isHovered ? colors.blue : 'white', marginBottom: '15px', transition: 'color 0.3s' }}>
          <Icon />
        </div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '10px', textTransform: 'uppercase' }}>{title}</h3>
        <p style={{ color: '#888', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>{description}</p>
      </div>
    </motion.div>
  );
};

// 2. A função principal (O NOME DEVE SER 'Services')
const Services = () => {
  const serviceList = [
    { title: "Cyber Security", description: "Proteção de dados e análise de vulnerabilidades.", icon: FaShieldAlt },
    { title: "Game Dev", description: "Desenvolvimento de jogos com Unity e Unreal.", icon: FaGamepad },
    { title: "Software Dev", description: "Sistemas modernos com React e Node.js.", icon: FaCode },
    { title: "Full Stack", description: "Desenvolvimento do Front ao Backend.", icon: FaLaptopCode }
  ];

  return (
    <section id="services" style={{ padding: '80px 20px', maxWidth: '1100px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '50px', textTransform: 'uppercase', letterSpacing: '4px' }}>Projetos</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px' }}>
        {serviceList.map((service, index) => (
          <ServiceCard key={index} index={index} {...service} />
        ))}
      </div>
    </section>
  );
};

export default Services;