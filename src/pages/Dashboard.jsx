import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../firebase';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  deleteDoc, 
  doc, 
  updateDoc, 
  query, 
  orderBy,
  limit 
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  // --- ESTADOS ---
  const [categories, setCategories] = useState([]);
  const [projects, setProjects] = useState([]);
  const [logs, setLogs] = useState([]); 
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null); // NOVO: Controle de edição do Blog
  const [errorMessage, setErrorMessage] = useState('');
  const [killTarget, setKillTarget] = useState(null);
  const logSent = useRef(false);
  const navigate = useNavigate();

  const [project, setProject] = useState({ 
    titulo: '', resumo: '', objetivo: '', paraQuem: '', categoria: '', imagemUrl: '' 
  });

  const [activeTab, setActiveTab] = useState('STAT');
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ 
    titulo: '', conteudo: '', categoria: '', imagemUrl: '', resumo: '' 
  });

  // --- AUDIO ENGINE ---
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.type = 'square'; 
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime); 
      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.1);
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) { console.log("Erro de áudio"); }
  };

  const playErrorSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.type = 'sawtooth'; 
      oscillator.frequency.setValueAtTime(300, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.2);
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.2);
    } catch (e) { console.log("Erro de áudio"); }
  };

  const registerAccessLog = async (userEmail) => {
    try {
      const res = await fetch('http://ip-api.com/json/');
      const data = await res.json();
      await addDoc(collection(db, "audit_logs"), {
        admin: userEmail,
        timestamp: new Date().toISOString(),
        ip: data.query || "unknown",
        city: data.city || "unknown",
        isp: data.isp || "unknown",
        action: "LOGIN_SUCCESS"
      });
    } catch (e) { console.error("Falha ao registrar log"); }
  };

  useEffect(() => {
    if (auth.currentUser && !logSent.current) {
      registerAccessLog(auth.currentUser.email);
      logSent.current = true;
    }

    const unsubCat = onSnapshot(query(collection(db, "categorias"), orderBy("nome", "asc")), (s) => 
      setCategories(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    
    const unsubProj = onSnapshot(query(collection(db, "projetos"), orderBy("titulo", "asc")), (s) => 
      setProjects(s.docs.map(d => ({ id: d.id, ...d.data() }))));

    const unsubLogs = onSnapshot(query(collection(db, "audit_logs"), orderBy("timestamp", "desc"), limit(5)), (s) => 
      setLogs(s.docs.map(d => ({ id: d.id, ...d.data() }))));

    const unsubPosts = onSnapshot(query(collection(db, "posts"), orderBy("timestamp", "desc")), (s) => 
      setPosts(s.docs.map(d => ({ id: d.id, ...d.data() }))));

    return () => { unsubCat(); unsubProj(); unsubLogs(); unsubPosts(); };
  }, []);

  // --- HANDLERS ---
  const handleAddCategory = async () => {
    if (!newCategory.trim()) { playErrorSound(); return; }
    playBeep();
    await addDoc(collection(db, "categorias"), { nome: newCategory.trim() });
    setNewCategory('');
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    const obrigatorios = ['titulo', 'categoria', 'resumo', 'objetivo', 'paraQuem'];
    if (obrigatorios.find(campo => !project[campo]?.trim())) {
      playErrorSound();
      setErrorMessage(">>> FALHA: CAMPOS OBRIGATÓRIOS VAZIOS.");
      return;
    }
    playBeep();
    try {
      if (editingId) {
        await updateDoc(doc(db, "projetos", editingId), project);
      } else {
        await addDoc(collection(db, "projetos"), project);
      }
      setEditingId(null);
      setProject({ titulo: '', resumo: '', objetivo: '', paraQuem: '', categoria: '', imagemUrl: '' });
    } catch (e) { playErrorSound(); setErrorMessage(">>> ERRO_DB"); }
  };

  const handleSavePost = async (e) => {
    e.preventDefault();
    if (!newPost.titulo || !newPost.conteudo) { playErrorSound(); return; }
    playBeep();
    try {
      if (editingPostId) {
        // Lógica de Atualização
        await updateDoc(doc(db, "posts", editingPostId), newPost);
        setEditingPostId(null);
      } else {
        // Lógica de Inserção
        await addDoc(collection(db, "posts"), {
          ...newPost,
          data: new Date(),
          timestamp: new Date(),
          autor: auth.currentUser.email
        });
      }
      setNewPost({ titulo: '', conteudo: '', categoria: '', imagemUrl: '', resumo: '' });
    } catch (e) { playErrorSound(); }
  };

  const executeKill = async () => {
    playBeep();
    if (!killTarget) return;
    try {
      await deleteDoc(doc(db, killTarget.colecao, killTarget.id));
      setKillTarget(null);
    } catch (e) { playErrorSound(); }
  };

  return (
    <div style={styles.container}>
      <div style={styles.scanlines} />
      
      <AnimatePresence>
        {killTarget && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={styles.modalOverlay}>
            <motion.div style={styles.killModal}>
              <h3 style={styles.killTitle}>[ AVISO DE EXCLUSÃO ]</h3>
              <p>ELIMINAR: "{killTarget.titulo.toUpperCase()}"?</p>
              <div style={styles.modalActions}>
                <button onClick={executeKill} style={styles.confirmBtn}>EXECUTAR</button>
                <button onClick={() => setKillTarget(null)} style={styles.cancelBtn}>ABORTAR</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header style={styles.header}>
        <div style={styles.tabs}>
          <span onClick={() => {playBeep(); setActiveTab('STAT')}} style={activeTab === 'STAT' ? styles.activeTab : styles.tab}>STAT (PROJECTS)</span>
          <span onClick={() => {playBeep(); setActiveTab('DATA')}} style={activeTab === 'DATA' ? styles.activeTab : styles.tab}>DATA (BLOG)</span>
        </div>
        <button onClick={() => signOut(auth).then(() => navigate('/admin'))} style={styles.logoutBtn}>[ LOGOUT ]</button>
      </header>

      <div style={styles.mainScreen}>
        {activeTab === 'STAT' ? (
          <>
            <div style={styles.grid}>
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>// CATEGORIES_DATABASE</h2>
                <div style={styles.inputGroup}>
                  <input value={newCategory} onChange={e => setNewCategory(e.target.value)} style={styles.input} placeholder="NOVA_CLASSE" />
                  <button onClick={handleAddCategory} style={styles.actionBtn}>ADD</button>
                </div>
                <ul style={styles.list}>
                  {categories.map(cat => (
                    <li key={cat.id} style={styles.listItem}>
                      <span>{cat.nome.toUpperCase()}</span>
                      <button onClick={() => setKillTarget({colecao: 'categorias', id: cat.id, titulo: cat.nome})} style={styles.deleteBtnSmall}>[X]</button>
                    </li>
                  ))}
                </ul>
                <h2 style={{...styles.sectionTitle, marginTop: '40px'}}>// SECURITY_AUDIT_LOGS</h2>
                {logs.map(log => <div key={log.id} style={{fontSize:'0.65rem', borderLeft:'2px solid #1aff80', paddingLeft:'10px', marginBottom:'5px'}}>[{new Date(log.timestamp).toLocaleTimeString()}] {log.ip} | {log.city}</div>)}
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>// ACTIVE_PROJECTS_LOG</h2>
                <div style={styles.scrollArea}>
                  {projects.map(proj => (
                    <div key={proj.id} style={styles.projectCard}>
                      <div style={{ flex: 1 }}>
                        <div style={styles.projTitle}>{proj.titulo}</div>
                        <div style={styles.projSub}>CLASS: {proj.categoria}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => { setEditingId(proj.id); setProject(proj); }} style={styles.editBtn}>EDIT</button>
                        <button onClick={() => setKillTarget({colecao: 'projetos', id: proj.id, titulo: proj.titulo})} style={styles.deleteBtnSmall}>KILL</button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <section style={styles.terminalForm}>
              <h2 style={styles.sectionTitle}>{editingId ? `// MODIFY: ${editingId}` : "// NEW_PROJECT_ENTRY"}</h2>
              <form onSubmit={handleSaveProject} style={styles.formGrid}>
                <input placeholder="TITLE" value={project.titulo} onChange={e => setProject({...project, titulo: e.target.value})} style={styles.input} />
                <select value={project.categoria} onChange={e => setProject({...project, categoria: e.target.value})} style={styles.input}>
                  <option value="">SELECT_CATEGORY</option>
                  {categories.map(cat => <option key={cat.id} value={cat.nome}>{cat.nome}</option>)}
                </select>
                <input placeholder="IMAGE_URL" value={project.imagemUrl} onChange={e => setProject({...project, imagemUrl: e.target.value})} style={{...styles.input, gridColumn: 'span 2'}} />
                <textarea placeholder="SUMMARY" value={project.resumo} onChange={e => setProject({...project, resumo: e.target.value})} style={{...styles.input, gridColumn: 'span 2', height: '60px'}} />
                <input placeholder="OBJECTIVE" value={project.objetivo} onChange={e => setProject({...project, objetivo: e.target.value})} style={styles.input} />
                <input placeholder="AUDIENCE" value={project.paraQuem} onChange={e => setProject({...project, paraQuem: e.target.value})} style={styles.input} />
                <button type="submit" style={styles.submitBtn}>{editingId ? "COMMIT_CHANGES" : "EXECUTE_PUBLICATION"}</button>
              </form>
            </section>
          </>
        ) : (
          <section>
            <h2 style={styles.sectionTitle}>{editingPostId ? `// EDIT_MODE: ${editingPostId}` : "// BLOG_PUBLISHER_PROTOCOL"}</h2>
            <div style={styles.grid}>
              <form onSubmit={handleSavePost} style={styles.formGrid}>
                <input placeholder="POST_TITLE" value={newPost.titulo} onChange={e => setNewPost({...newPost, titulo: e.target.value})} style={styles.input} />
                <input placeholder="CATEGORY" value={newPost.categoria} onChange={e => setNewPost({...newPost, categoria: e.target.value})} style={styles.input} />
                <input placeholder="BANNER_URL" value={newPost.imagemUrl} onChange={e => setNewPost({...newPost, imagemUrl: e.target.value})} style={{...styles.input, gridColumn: 'span 2'}} />
                <textarea placeholder="RESUMO (PARA O CARD)" value={newPost.resumo} onChange={e => setNewPost({...newPost, resumo: e.target.value})} style={{...styles.input, gridColumn: 'span 2', height: '60px'}} />
                <textarea placeholder="CONTENT (HTML/MARKDOWN)" value={newPost.conteudo} onChange={e => setNewPost({...newPost, conteudo: e.target.value})} style={{...styles.input, gridColumn: 'span 2', height: '150px'}} />
                
                <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px' }}>
                  <button type="submit" style={{...styles.submitBtn, flex: 3}}>{editingPostId ? "COMMIT_EDIT" : "EXECUTE_BLOG_DEPLOY"}</button>
                  {editingPostId && (
                    <button type="button" onClick={() => {setEditingPostId(null); setNewPost({ titulo: '', conteudo: '', categoria: '', imagemUrl: '', resumo: '' });}} style={{...styles.submitBtn, background: '#ff4d4d', flex: 1}}>ABORT</button>
                  )}
                </div>
              </form>
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>// PUBLISHED_LOGS</h2>
                <div style={styles.scrollArea}>
                  {posts.map(p => (
                    <div key={p.id} style={styles.projectCard}>
                      <div style={{ flex: 1 }}>
                        <div style={styles.projTitle}>{p.titulo}</div>
                        <div style={styles.projSub}>BY: {p.autor?.split('@')[0]}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        {/* BOTÃO DE EDITAR ADICIONADO */}
                        <button onClick={() => { setEditingPostId(p.id); setNewPost(p); playBeep(); }} style={styles.editBtn}>EDIT</button>
                        <button onClick={() => setKillTarget({colecao: 'posts', id: p.id, titulo: p.titulo})} style={styles.deleteBtnSmall}>KILL</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
      <footer style={styles.footer}><span>HP 100/100</span><span>IGOR_OS V.1.0.0</span><span>RADS 0</span></footer>
    </div>
  );
};

// --- ESTILOS MANTIDOS ---
const styles = {
  container: { backgroundColor: '#05070a', color: '#1aff80', minHeight: '100vh', padding: '20px', fontFamily: '"Courier New", monospace', position: 'relative' },
  scanlines: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)', backgroundSize: '100% 4px', pointerEvents: 'none', zIndex: 10 },
  header: { borderBottom: '2px solid #1aff80', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px' },
  tabs: { display: 'flex', gap: '30px', fontWeight: 'bold' },
  activeTab: { borderBottom: '4px solid #1aff80', paddingBottom: '5px', cursor: 'pointer' },
  tab: { opacity: 0.5, cursor: 'pointer' },
  logoutBtn: { background: 'transparent', color: '#1aff80', border: '1px solid #1aff80', padding: '5px 15px', cursor: 'pointer' },
  mainScreen: { border: '2px solid #1aff80', padding: '20px', backgroundColor: 'rgba(26, 255, 128, 0.05)', borderRadius: '10px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '30px' },
  section: { borderRight: '1px solid rgba(26, 255, 128, 0.3)', paddingRight: '20px' },
  sectionTitle: { fontSize: '1rem', borderBottom: '1px solid #1aff80', paddingBottom: '5px', marginBottom: '15px' },
  inputGroup: { display: 'flex', gap: '10px', marginBottom: '20px' },
  input: { background: 'rgba(0,0,0,0.5)', border: '1px solid #1aff80', color: '#1aff80', padding: '10px', width: '100%', outline: 'none', fontFamily: 'inherit' },
  actionBtn: { background: '#1aff80', color: '#000', border: 'none', padding: '10px', cursor: 'pointer', fontWeight: 'bold' },
  list: { listStyle: 'none', padding: 0 },
  listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(26, 255, 128, 0.1)' },
  projectCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', border: '1px solid rgba(26, 255, 128, 0.2)', marginBottom: '10px' },
  projTitle: { fontWeight: 'bold' },
  projSub: { fontSize: '0.8rem', opacity: 0.7 },
  editBtn: { background: 'transparent', color: '#1aff80', border: '1px solid #1aff80', padding: '5px 10px', cursor: 'pointer' },
  deleteBtnSmall: { color: '#ff4d4d', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 'bold' },
  terminalForm: { marginTop: '30px', paddingTop: '20px', borderTop: '2px solid #1aff80' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
  submitBtn: { gridColumn: 'span 2', padding: '15px', background: '#1aff80', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer' },
  footer: { marginTop: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 },
  killModal: { width: '400px', padding: '30px', border: '3px solid #ff4d4d', backgroundColor: '#05070a', textAlign: 'center', boxShadow: '0 0 20px #ff4d4d' },
  killTitle: { color: '#ff4d4d', marginBottom: '20px' },
  modalActions: { display: 'flex', gap: '20px', justifyContent: 'center' },
  confirmBtn: { padding: '10px 20px', background: '#ff4d4d', color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer' },
  cancelBtn: { padding: '10px 20px', background: 'transparent', color: '#1aff80', border: '1px solid #1aff80', fontWeight: 'bold', cursor: 'pointer' },
  scrollArea: { maxHeight: '300px', overflowY: 'auto' }
};

export default Dashboard;