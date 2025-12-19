import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCode, FaShieldAlt, FaGamepad, FaLaptopCode, FaTerminal } from "react-icons/fa";
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'; // Importação do onSnapshot para tempo real
import { db } from '../firebase';

// Mapa de ícones para as categorias (Case-sensitive com o Dashboard)
const iconMap = {
  "Cyber Security": FaShieldAlt,
  "Game Dev": FaGamepad,
  "Software Dev": FaCode,
  "Full Stack": FaLaptopCode,
  "Default": FaTerminal
};

const Services = () => {
  const [categories, setCategories] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const colors = { 
    blue: '#00d2ff', 
    purple: '#9d50bb', 
    textGray: '#888888',
    darkBg: '#05070a'
  };

  useEffect(() => {
    // 1. Escuta Categorias em tempo real
    const qCat = query(collection(db, "categorias"), orderBy("nome", "asc"));
    const unsubscribeCats = onSnapshot(qCat, (snapshot) => {
      const catData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCategories(catData);
    }, (error) => {
      console.error("Erro ao sincronizar categorias:", error);
    });

    // 2. Escuta Projetos em tempo real
    const qProj = query(collection(db, "projetos"));
    const unsubscribeProjs = onSnapshot(qProj, (snapshot) => {
      const projData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(projData);
      setLoading(false);
    }, (error) => {
      console.error("Erro ao sincronizar projetos:", error);
      setLoading(false);
    });

    // Limpa as conexões ao desmontar o componente para evitar consumo de dados
    return () => {
      unsubscribeCats();
      unsubscribeProjs();
    };
  }, []);

  if (loading) {
    return (
      <div style={{ 
        textAlign: 'center', 
        color: colors.blue, 
        padding: '100px 20px', 
        fontFamily: 'monospace',
        backgroundColor: colors.darkBg 
      }}>
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
           SINCRONIZANDO_COM_O_CORE...
        </motion.span>
      </div>
    );
  }

  return (
    <section id="services" style={{ padding: '80px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '80px' }}>
        <h2 style={{ fontSize: '2.5rem', letterSpacing: '8px', textTransform: 'uppercase', margin: 0 }}>
          PROJETOS
        </h2>
        <div style={{ width: '80px', height: '4px', background: colors.blue, margin: '20px auto' }} />
      </header>

      {categories.length === 0 ? (
        <div style={{ textAlign: 'center', color: colors.textGray }}>
           Nenhuma categoria configurada no Dashboard.
        </div>
      ) : (
        categories.map((cat) => {
          // Filtra projetos vinculados a esta categoria específica
          const projectsInCategory = projects.filter(p => p.categoria === cat.nome);
          const Icon = iconMap[cat.nome] || iconMap["Default"];

          return (
            <div key={cat.id} style={{ marginBottom: '100px' }}>
              {/* Cabeçalho Dinâmico da Categoria */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '20px', 
                  marginBottom: '40px', 
                  borderLeft: `4px solid ${colors.blue}`, 
                  paddingLeft: '20px' 
                }}
              >
                <div style={{ fontSize: '2.5rem', color: colors.blue }}>
                  <Icon />
                </div>
                <h3 style={{ fontSize: '2rem', textTransform: 'uppercase', margin: 0, fontWeight: '900' }}>
                  {cat.nome}
                </h3>
              </motion.div>

              {/* Grid de Projetos (Cases de Sucesso) */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
                gap: '30px' 
              }}>
                {projectsInCategory.length > 0 ? (
                  projectsInCategory.map((proj) => (
                    <motion.div
                      key={proj.id}
                      whileHover={{ y: -10, borderColor: colors.blue }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      style={{
                        background: 'rgba(255,255,255,0.02)',
                        padding: '30px',
                        borderRadius: '20px',
                        border: '1px solid rgba(255,255,255,0.05)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'border-color 0.3s ease'
                      }}
                    >
                      <h4 style={{ color: colors.blue, marginBottom: '15px', fontSize: '1.4rem', fontWeight: '700' }}>
                        {proj.titulo}
                      </h4>
                      <p style={{ color: colors.textGray, fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '25px' }}>
                        {proj.resumo}
                      </p>
                      
                      <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                        <p style={{ fontSize: '0.85rem', color: '#fff', margin: '5px 0', opacity: 0.8 }}>
                          <strong style={{ color: colors.blue }}>MISSÃO:</strong> {proj.objetivo}
                        </p>
                        {proj.paraQuem && (
                          <p style={{ fontSize: '0.85rem', color: '#fff', margin: '5px 0', opacity: 0.8 }}>
                            <strong style={{ color: colors.purple }}>PÚBLICO:</strong> {proj.paraQuem}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p style={{ color: colors.textGray, fontStyle: 'italic', gridColumn: '1/-1' }}>
                     Aguardando publicação de cases nesta categoria...
                  </p>
                )}
              </div>
            </div>
          );
        })
      )}
    </section>
  );
};

export default Services;