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
  const [categories, setCategories] = useState([]);
  const [projects, setProjects] = useState([]);
  const [logs, setLogs] = useState([]); // Sistema de Auditoria
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [killTarget, setKillTarget] = useState(null);
  const logSent = useRef(false); // ADICIONE ESTA LINHA AQUI

  const [project, setProject] = useState({ 
    titulo: '', resumo: '', objetivo: '', paraQuem: '', categoria: '', imagemUrl: '' 
  });
  
  const navigate = useNavigate();

  // AUDIO ENGINE - WEB AUDIO API
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

  // SISTEMA DE AUDITORIA: REGISTRAR ACESSO
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
    // REGISTRO COM TRAVA DE SEGURANÇA CONTRA DUPLICIDADE
    if (auth.currentUser && !logSent.current) {
      registerAccessLog(auth.currentUser.email);
      logSent.current = true; // Marca como enviado para esta sessão
    }

    const qCat = query(collection(db, "categorias"), orderBy("nome", "asc"));
    const unsubCat = onSnapshot(qCat, (snapshot) => {
      setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qProj = query(collection(db, "projetos"), orderBy("titulo", "asc"));
    const unsubProj = onSnapshot(qProj, (snapshot) => {
      setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qLogs = query(collection(db, "audit_logs"), orderBy("timestamp", "desc"), limit(5));
    const unsubLogs = onSnapshot(qLogs, (snapshot) => {
      setLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => { unsubCat(); unsubProj(); unsubLogs(); };
  }, []);

  // HANDLERS (Categorias, Projetos e Kill System)
  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      playErrorSound();
      setErrorMessage(">>> FALHA_CRÍTICA: IDENTIFICADOR NÃO PODE SER NULO.");
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }
    playBeep();
    try {
      await addDoc(collection(db, "categorias"), { nome: newCategory.trim() });
      setNewCategory('');
    } catch (e) { setErrorMessage(">>> ERRO_DE_SISTEMA: FALHA AO GRAVAR NO DATABASE."); }
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    const obrigatorios = ['titulo', 'categoria', 'resumo', 'objetivo', 'paraQuem'];
    const vazio = obrigatorios.find(campo => !project[campo]?.trim());

    if (vazio) {
      playErrorSound();
      setErrorMessage(`>>> FALHA_CRÍTICA: O CAMPO [${vazio.toUpperCase()}] É OBRIGATÓRIO.`);
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
    } catch (e) { setErrorMessage(">>> ERRO_DE_SISTEMA: FALHA NA COMUNICAÇÃO CLOUD."); }
  };

  const executeKill = async () => {
    playBeep();
    if (!killTarget) return;
    try {
      await deleteDoc(doc(db, killTarget.colecao, killTarget.id));
      setKillTarget(null);
    } catch (error) { playErrorSound(); setKillTarget(null); }
  };

  return (
    <div style={styles.container}>
      <div style={styles.scanlines} />
      
      {/* MODAL DE SEGURANÇA (KILL) */}
      <AnimatePresence>
        {killTarget && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={styles.modalOverlay}>
            <motion.div initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }} style={styles.killModal}>
              <h3 style={styles.killTitle}>[ AVISO DE EXCLUSÃO ]</h3>
              <p style={styles.killText}>DESEJA ELIMINAR O REGISTRO: <br/> <span style={{ color: '#fff' }}>"{killTarget.titulo.toUpperCase()}"</span>?</p>
              <div style={styles.modalActions}>
                <button onClick={executeKill} style={styles.confirmBtn}>EXECUTAR_KILL</button>
                <button onClick={() => setKillTarget(null)} style={styles.cancelBtn}>ABORTAR</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header style={styles.header}>
        <div style={styles.tabs}><span style={styles.activeTab}>STAT</span><span style={styles.tab}>DATA</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontSize: '0.7rem', color: '#1aff80' }}>ID: {auth.currentUser?.email}</span>
          <button onClick={() => { playBeep(); signOut(auth).then(() => navigate('/admin')); }} style={styles.logoutBtn}>[ LOGOUT ]</button>
        </div>
      </header>

      <div style={styles.mainScreen}>
        <div style={styles.grid}>
          {/* COLUNA ESQUERDA: DATABASE & AUDITORIA */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>// CATEGORIES_DATABASE</h2>
            <div style={styles.inputGroup}>
              <input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="NOVA_CLASSE" style={styles.input} />
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
            <div style={{ fontSize: '0.65rem', opacity: 0.8 }}>
              {logs.map(log => (
                <div key={log.id} style={{ marginBottom: '10px', borderLeft: '2px solid #1aff80', paddingLeft: '10px' }}>
                  <div style={{ color: '#fff' }}>[{new Date(log.timestamp).toLocaleTimeString()}] LOGIN_OK</div>
                  <div>IP: {log.ip} | {log.city}</div>
                </div>
              ))}
            </div>
          </section>

          {/* COLUNA DIREITA: PROJETOS ATIVOS */}
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

        {/* TERMINAL DE ENTRADA (FORMULÁRIO) */}
        <section style={styles.terminalForm}>
          <h2 style={styles.sectionTitle}>{editingId ? `// MODIFY_ENTRY: ${editingId}` : "// NEW_PROJECT_ENTRY"}</h2>
          <form onSubmit={handleSaveProject} style={styles.formGrid}>
            <input placeholder="TITLE" value={project.titulo} onChange={e => setProject({...project, titulo: e.target.value})} style={styles.input} />
            <select value={project.categoria} onChange={e => setProject({...project, categoria: e.target.value})} style={styles.input}>
              <option value="">SELECT_CATEGORY</option>
              {categories.map(cat => <option key={cat.id} value={cat.nome}>{cat.nome}</option>)}
            </select>
            <input placeholder="IMAGE_URL" value={project.imagemUrl} onChange={e => setProject({...project, imagemUrl: e.target.value})} style={{...styles.input, gridColumn: 'span 2'}} />
            <textarea placeholder="RESUMO" value={project.resumo} onChange={e => setProject({...project, resumo: e.target.value})} style={{...styles.input, gridColumn: 'span 2', height: '60px'}} />
            <button type="submit" style={styles.submitBtn}>{editingId ? "COMMIT_CHANGES" : "EXECUTE_PUBLICATION"}</button>
          </form>
        </section>
      </div>

      <footer style={styles.footer}>
        <span>HP 100/100</span><span>IGOR_OS V.1.0.0</span><span>AUDIT_ACTIVE: TRUE</span>
      </footer>
    </div>
  );
};

// Estilos consolidados (conforme seu layout de terminal)
const styles = {
  container: { backgroundColor: '#05070a', color: '#1aff80', minHeight: '100vh', padding: '20px', fontFamily: '"Courier New", monospace', position: 'relative' },
  scanlines: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)', backgroundSize: '100% 4px', pointerEvents: 'none', zIndex: 10 },
  header: { borderBottom: '2px solid #1aff80', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px' },
  tabs: { display: 'flex', gap: '30px' },
  activeTab: { borderBottom: '4px solid #1aff80' },
  tab: { opacity: 0.5 },
  logoutBtn: { background: 'transparent', color: '#1aff80', border: '1px solid #1aff80', cursor: 'pointer' },
  mainScreen: { border: '2px solid #1aff80', padding: '20px', backgroundColor: 'rgba(26, 255, 128, 0.05)' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '30px' },
  section: { borderRight: '1px solid rgba(26, 255, 128, 0.3)', paddingRight: '20px' },
  sectionTitle: { fontSize: '1rem', borderBottom: '1px solid #1aff80', marginBottom: '15px' },
  inputGroup: { display: 'flex', gap: '10px', marginBottom: '20px' },
  input: { background: 'rgba(0,0,0,0.5)', border: '1px solid #1aff80', color: '#1aff80', padding: '10px', width: '100%' },
  actionBtn: { background: '#1aff80', color: '#000', border: 'none', padding: '10px', fontWeight: 'bold' },
  list: { listStyle: 'none', padding: 0 },
  listItem: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(26, 255, 128, 0.1)' },
  projectCard: { display: 'flex', justifyContent: 'space-between', padding: '15px', border: '1px solid rgba(26, 255, 128, 0.2)', marginBottom: '10px' },
  projTitle: { fontWeight: 'bold' },
  projSub: { fontSize: '0.8rem', opacity: 0.7 },
  editBtn: { background: 'transparent', color: '#1aff80', border: '1px solid #1aff80', padding: '5px 10px' },
  deleteBtnSmall: { color: '#ff4d4d', background: 'transparent', border: 'none', cursor: 'pointer' },
  terminalForm: { marginTop: '30px', borderTop: '2px solid #1aff80', paddingTop: '20px' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
  submitBtn: { gridColumn: 'span 2', padding: '15px', background: '#1aff80', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer' },
  footer: { marginTop: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 },
  killModal: { width: '400px', padding: '30px', border: '3px solid #ff4d4d', backgroundColor: '#05070a', textAlign: 'center' },
  killTitle: { color: '#ff4d4d', marginBottom: '20px' },
  killText: { color: '#1aff80', marginBottom: '20px' },
  modalActions: { display: 'flex', gap: '20px', justifyContent: 'center' },
  confirmBtn: { padding: '10px 20px', background: '#ff4d4d', color: '#000', border: 'none', fontWeight: 'bold' },
  cancelBtn: { padding: '10px 20px', background: 'transparent', color: '#1aff80', border: '1px solid #1aff80' }
};

export default Dashboard;