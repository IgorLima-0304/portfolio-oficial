import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { signOut } from 'firebase/auth'; // Importação para o logout
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [project, setProject] = useState({ 
    titulo: '', 
    resumo: '', 
    objetivo: '', 
    paraQuem: '', 
    categoria: '' 
  });
  const navigate = useNavigate();

  // Carregar categorias do Firestore
  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "categorias"));
      setCategories(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // FUNÇÃO DE LOGOUT: Encerra a sessão e limpa o token
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Sessão encerrada.");
      navigate('/admin'); // Redireciona para o login e aciona o Firewall de Rota
    } catch (error) {
      console.error("Erro ao deslogar:", error);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory) return;
    try {
      await addDoc(collection(db, "categorias"), { nome: newCategory });
      setNewCategory('');
      fetchCategories();
    } catch (error) {
      alert("Erro ao adicionar categoria.");
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!project.categoria) return alert("Selecione uma categoria!");
    try {
      await addDoc(collection(db, "projetos"), project);
      alert("Case de sucesso publicado no sistema!");
      setProject({ titulo: '', resumo: '', objetivo: '', paraQuem: '', categoria: '' });
    } catch (error) {
      alert("Erro ao publicar projeto.");
    }
  };

  return (
    <div style={{ backgroundColor: '#05070a', color: '#00ff00', minHeight: '100vh', padding: '40px', fontFamily: 'monospace' }}>
      {/* HEADER DO PAINEL */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #00ff00', paddingBottom: '20px' }}>
        <h1 style={{ margin: 0 }}> PAINEL_DE_CONTROLE_IGOR_OS</h1>
        <button 
          onClick={handleLogout} 
          style={{ 
            padding: '10px 20px', 
            cursor: 'pointer', 
            border: '1px solid #ff0000', 
            background: 'rgba(255,0,0,0.1)', 
            color: '#ff0000',
            fontWeight: 'bold'
          }}
        >
          [ TERMINAR_SESSÃO ]
        </button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '30px' }}>
        
        {/* SEÇÃO DE CATEGORIAS */}
        <section style={{ border: '1px solid #00ff00', padding: '20px', background: 'rgba(0,255,0,0.02)' }}>
          <h3># GERENCIAR_CATEGORIAS</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input 
              value={newCategory} 
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="NOME DA CATEGORIA"
              style={{ background: 'transparent', border: '1px solid #00ff00', color: '#00ff00', padding: '10px', flex: 1 }}
            />
            <button onClick={handleAddCategory} style={{ background: '#00ff00', color: '#000', border: 'none', padding: '10px', fontWeight: 'bold', cursor: 'pointer' }}>ADD</button>
          </div>
          
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {categories.map(cat => (
              <li key={cat.id} style={{ padding: '8px 0', borderBottom: '1px solid rgba(0,255,0,0.1)' }}>
                 {cat.nome}
              </li>
            ))}
          </ul>
        </section>

        {/* SEÇÃO DE PROJETOS/CASES */}
        <section style={{ border: '1px solid #00ff00', padding: '20px', background: 'rgba(0,255,0,0.02)' }}>
          <h3># PUBLICAR_NOVO_CASE (STORYTELLING)</h3>
          <form onSubmit={handleAddProject} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input placeholder="TÍTULO DO PROJETO" value={project.titulo} onChange={e => setProject({...project, titulo: e.target.value})} style={{ background: 'transparent', border: '1px solid #00ff00', color: '#00ff00', padding: '10px' }} required />
            <textarea placeholder="RESUMO/HISTÓRIA DO PROJETO" value={project.resumo} onChange={e => setProject({...project, resumo: e.target.value})} style={{ background: 'transparent', border: '1px solid #00ff00', color: '#00ff00', padding: '10px', minHeight: '80px' }} required />
            <textarea placeholder="OBJETIVO (PROBLEMA RESOLVIDO)" value={project.objetivo} onChange={e => setProject({...project, objetivo: e.target.value})} style={{ background: 'transparent', border: '1px solid #00ff00', color: '#00ff00', padding: '10px' }} />
            <textarea placeholder="PÚBLICO-ALVO (PARA QUEM?)" value={project.paraQuem} onChange={e => setProject({...project, paraQuem: e.target.value})} style={{ background: 'transparent', border: '1px solid #00ff00', color: '#00ff00', padding: '10px' }} />
            
            <select value={project.categoria} onChange={e => setProject({...project, categoria: e.target.value})} style={{ background: '#000', color: '#00ff00', padding: '10px', border: '1px solid #00ff00' }} required>
              <option value="">-- SELECIONE A CATEGORIA --</option>
              {categories.map(cat => <option key={cat.id} value={cat.nome}>{cat.nome}</option>)}
            </select>

            <button type="submit" style={{ backgroundColor: '#00ff00', color: '#000', border: 'none', padding: '12px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
              EXECUTAR_PUBLICAÇÃO_MUNDIAL
            </button>
          </form>
        </section>

      </div>
    </div>
  );
};

export default Dashboard;