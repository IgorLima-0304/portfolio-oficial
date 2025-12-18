import React from 'react';
import { motion } from 'framer-motion';
// Importando os novos ícones necessários
import { FaReact, FaNodeJs, FaJs, FaUnity, FaShieldAlt, FaGitAlt, FaPython, FaMicrosoft } from "react-icons/fa";
import { SiUnrealengine } from "react-icons/si"; // Ícone específico da Unreal

const Skills = () => {
  // Lista atualizada com Python, Unreal e Power Platform
  const mySkills = [
    { name: "React", icon: <FaReact /> },
    { name: "Node.js", icon: <FaNodeJs /> },
    { name: "JavaScript", icon: <FaJs /> },
    { name: "Python", icon: <FaPython /> },
    { name: "Unreal Engine", icon: <SiUnrealengine /> },
    { name: "Unity", icon: <FaUnity /> },
    { name: "Power Platform", icon: <FaMicrosoft /> }, // Power Apps e Power Automate
    { name: "CyberSecurity", icon: <FaShieldAlt /> },
    { name: "Git", icon: <FaGitAlt /> }
  ];

  const colors = {
    blue: '#00d2ff',
    purple: '#9d50bb',
  };

  return (
    <section id="skills" style={{ padding: '80px 20px', maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
      <motion.h2 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{ fontSize: '2rem', marginBottom: '50px', textTransform: 'uppercase', letterSpacing: '4px' }}
      >
        Minhas <span style={{ color: colors.blue }}>Habilidades</span>
      </motion.h2>

      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        justifyContent: 'center', 
        gap: '15px' 
      }}>
        {mySkills.map((skill, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            viewport={{ amount: 0.3 }}
            
            whileHover={{ 
              scale: 1.08, 
              color: colors.blue,
              borderColor: colors.blue,
              boxShadow: `0 0 20px ${colors.blue}`
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 22px',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '50px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'default',
              backgroundColor: 'rgba(255,255,255,0.02)',
              transition: 'all 0.3s ease',
              color: 'white'
            }}
          >
            <span style={{ fontSize: '1.4rem', display: 'flex' }}>{skill.icon}</span>
            {skill.name}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Skills;