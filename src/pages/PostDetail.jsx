import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

const PostDetail = ({ colors }) => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const docRef = doc(db, "posts", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPost(docSnap.data());
        } else {
          navigate('/blog');
        }
      } catch (error) {
        console.error("Erro ao carregar post:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, navigate]);

  if (loading) return <div style={{backgroundColor: colors.dark, height: '100vh', color: colors.blue, display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'monospace'}}>CARREGANDO_PROTOCOLO...</div>;

  // Formatação de data segura para Timestamps do Firebase
  const formatarData = (data) => {
    if (!data) return "DATA_DESCONHECIDA";
    const d = data.toDate ? data.toDate() : new Date(data);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ backgroundColor: colors.dark, minHeight: '100vh', color: 'white' }}>
      <Navbar />
      <article style={{ padding: '120px 20px', maxWidth: '800px', margin: '0 auto' }}>
        <button onClick={() => navigate('/blog')} style={{ background: 'transparent', color: colors.blue, border: `1px solid ${colors.blue}`, padding: '5px 15px', cursor: 'pointer', marginBottom: '30px', fontFamily: 'monospace' }}>
          [ VOLTAR_AO_LOG ]
        </button>

        {post.imagemUrl && <img src={post.imagemUrl} alt={post.titulo} style={{ width: '100%', borderRadius: '8px', marginBottom: '40px', border: `1px solid ${colors.blue}33` }} />}
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <span style={{ color: colors.blue, fontFamily: 'monospace' }}>// CATEGORIA: {post.categoria?.toUpperCase()}</span>
          {/* EXIBIÇÃO DA FONTE */}
          {post.fonteNome && (
            <span style={{ fontSize: '0.7rem', opacity: 0.6, fontFamily: 'monospace' }}>
              FONTE: <a href={post.fonteLink} target="_blank" rel="noreferrer" style={{ color: colors.blue }}>{post.fonteNome.toUpperCase()}</a>
            </span>
          )}
        </div>

        <h1 style={{ fontSize: '2.5rem', margin: '15px 0', lineHeight: '1.2' }}>{post.titulo}</h1>
        <div style={{ opacity: 0.6, fontSize: '0.8rem', marginBottom: '40px', fontFamily: 'monospace' }}>
          DATA_DE_REGISTRO: {formatarData(post.data)}
        </div>
        
        <div 
          style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#ccc', textAlign: 'justify', whiteSpace: 'pre-wrap' }}
          dangerouslySetInnerHTML={{ __html: post.conteudo }} 
        />
      </article>
    </div>
  );
};

export default PostDetail;