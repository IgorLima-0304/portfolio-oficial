import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaReact, 
  FaUnity, 
  FaShieldAlt, 
  FaGitAlt, 
  FaPython, 
  FaMicrosoft, 
  FaLinux // Importado ícone do Linux
} from "react-icons/fa";
import { SiUnrealengine, SiBlender } from "react-icons/si";

const Skills = () => {
  // 1. Definição das Skills atualizada (Linux e Git em 100%)
  const mySkills = [
    { name: "React", icon: <FaReact />, level: 80 },
    { name: "Python", icon: <FaPython />, level: 25 },
    { name: "Unreal Engine", icon: <SiUnrealengine />, level: 10 },
    { name: "Unity", icon: <FaUnity />, level: 20 },
    { name: "Blender", icon: <SiBlender />, level: 45 },
    { name: "Power Platform", icon: <FaMicrosoft />, level: 100 },
    { name: "CyberSecurity", icon: <FaShieldAlt />, level: 20 },
    { name: "Git", icon: <FaGitAlt />, level: 100 }, // Ajustado para 100%
    { name: "Linux", icon: <FaLinux />, level: 100 }  // Adicionado com 100%
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
            transition={{ duration: 0.4, delay: index * 0.08 }}
            viewport={{ once: true }}
            whileHover={{ 
              scale: 1.05, 
              borderColor: colors.blue,
              boxShadow: `0 0 15px ${colors.blue}44`
            }}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 22px',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '50px',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              cursor: 'default',
              backgroundColor: 'rgba(255,255,255,0.02)',
              overflow: 'hidden',
              color: 'white'
            }}
          >
            {/* BARRA DE PROFICIÊNCIA */}
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${skill.level}%` }}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                background: `linear-gradient(90deg, ${colors.blue}22, ${colors.purple}22)`,
                zIndex: 0
              }}
            />

            {/* CONTEÚDO */}
            <span style={{ fontSize: '1.4rem', display: 'flex', zIndex: 1, position: 'relative' }}>
              {skill.icon}
            </span>
            <span style={{ zIndex: 1, position: 'relative' }}>
              {skill.name}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Skills;