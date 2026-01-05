import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Blog = ({ colors }) => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // AJUSTE: Ordenação por timestamp para maior precisão
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // FUNÇÃO PARA FORMATAR DATA
  const formatarData = (dataFirebase) => {
    if (!dataFirebase) return "Data pendente";
    
    // Converte o Timestamp do Firebase (segundos) para milissegundos do JS
    const date = dataFirebase.seconds 
      ? new Date(dataFirebase.seconds * 1000) 
      : new Date(dataFirebase);

    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{ backgroundColor: colors.dark, minHeight: '100vh', color: 'white' }}>
      <Navbar />
      
      <main style={{ padding: '120px 20px', maxWidth: '1000px', margin: '0 auto' }}>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ color: colors.blue, fontFamily: 'monospace', marginBottom: '40px' }}
        >
          // TECH_LOG_FILES
        </motion.h1>

        <div style={styles.grid}>
          {posts.map((post) => (
            <motion.div 
              key={post.id}
              whileHover={{ scale: 1.02, borderColor: colors.blue }}
              onClick={() => navigate(`/blog/${post.id}`)}
              style={{ ...styles.card, borderColor: `${colors.blue}44` }}
            >
              {post.imagemUrl && (
                <img src={post.imagemUrl} alt={post.titulo} style={styles.image} />
              )}
              <div style={styles.content}>
                <span style={{ color: colors.blue, fontSize: '0.8rem' }}>[{post.categoria?.toUpperCase()}]</span>
                <h2 style={styles.title}>{post.titulo}</h2>
                <p style={styles.summary}>{post.resumo}</p>
                {/* AQUI ESTÁ A CORREÇÃO DA DATA */}
                <span style={styles.date}>DATA_REGISTRO: {formatarData(post.data)}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

// ... estilos permanecem os mesmos
const styles = {
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' },
  card: { background: 'rgba(255,255,255,0.02)', border: '1px solid', borderRadius: '8px', cursor: 'pointer', overflow: 'hidden', transition: 'all 0.3s' },
  image: { width: '100%', height: '180px', objectFit: 'cover', opacity: 0.8 },
  content: { padding: '20px' },
  title: { margin: '10px 0', fontSize: '1.2rem', lineHeight: '1.4' },
  summary: { color: '#888', fontSize: '0.9rem', marginBottom: '15px', height: '60px', overflow: 'hidden' },
  date: { fontSize: '0.7rem', opacity: 0.5, fontFamily: 'monospace' }
};

export default Blog;