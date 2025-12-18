import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  deleteDoc, 
  doc, 
  updateDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const [categories, setCategories] = useState([]);
  const [projects, setProjects] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [killTarget, setKillTarget] = useState(null);

  const [project, setProject] = useState({ 
    titulo: '', resumo: '', objetivo: '', paraQuem: '', categoria: '', imagemUrl: '' 
  });
  
  const navigate = useNavigate();

 //Audio engine - Web Audio API
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
      
      // Som 'sawtooth' para um alerta mais agressivo de terminal antigo
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

  useEffect(() => {
    const qCat = query(collection(db, "categorias"), orderBy("nome", "asc"));
    const unsubCat = onSnapshot(qCat, (snapshot) => {
      setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qProj = query(collection(db, "projetos"), orderBy("titulo", "asc"));
    const unsubProj = onSnapshot(qProj, (snapshot) => {
      setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => { unsubCat(); unsubProj(); };
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      playErrorSound(); // Feedback de Erro
      setErrorMessage(">>> FALHA_CRÍTICA: IDENTIFICADOR DA CATEGORIA NÃO PODE SER NULO.");
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }
    playBeep();
    try {
      await addDoc(collection(db, "categorias"), { nome: newCategory.trim() });
      setNewCategory('');
    } catch (e) {
      playErrorSound();
      setErrorMessage(">>> ERRO_DE_SISTEMA: FALHA AO GRAVAR NO DATABASE.");
    }
  };

  const startEdit = (proj) => {
    playBeep();
    setEditingId(proj.id);
    setProject({
      titulo: proj.titulo || '',
      resumo: proj.resumo || '',
      objetivo: proj.objetivo || '',
      paraQuem: proj.paraQuem || '',
      categoria: proj.categoria || '',
      imagemUrl: proj.imagemUrl || ''
    });
    setErrorMessage('');
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    playBeep();
    setEditingId(null);
    setProject({ titulo: '', resumo: '', objetivo: '', paraQuem: '', categoria: '', imagemUrl: '' });
    setErrorMessage('');
  };

  const confirmKill = (colecao, id, titulo) => {
    playBeep();
    setKillTarget({ colecao, id, titulo });
  };

  const executeKill = async () => {
    playBeep();
    if (!killTarget) return;
    try {
      await deleteDoc(doc(db, killTarget.colecao, killTarget.id));
      setKillTarget(null);
    } catch (error) {
      playErrorSound();
      setErrorMessage(">>> ERRO: ACESSO NEGADO AO PROTOCOLO DE DELEÇÃO.");
      setKillTarget(null);
    }
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    const obrigatorios = ['titulo', 'categoria', 'resumo', 'objetivo', 'paraQuem'];
    const vazio = obrigatorios.find(campo => !project[campo]?.trim());

    if (vazio) {
      playErrorSound(); // Feedback de Erro
      setErrorMessage(`>>> FALHA_CRÍTICA: O CAMPO [${vazio.toUpperCase()}] É OBRIGATÓRIO.`);
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    playBeep();
    try {
      if (editingId) {
        await updateDoc(doc(db, "projetos", editingId), project);
      } else {
        await addDoc(collection(db, "projetos"), project);
      }
      cancelEdit();
    } catch (e) {
      playErrorSound();
      setErrorMessage(">>> ERRO_DE_SISTEMA: FALHA NA COMUNICAÇÃO CLOUD.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.scanlines} />
      
      <AnimatePresence>
        {killTarget && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={styles.modalOverlay}>
            <motion.div initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }} style={styles.killModal}>
              <h3 style={styles.killTitle}>[ AVISO DE EXCLUSÃO ]</h3>
              <p style={styles.killText}>DESEJA ELIMINAR O REGISTRO: <br/> <span style={{ color: '#fff' }}>"{killTarget.titulo.toUpperCase()}"</span>?</p>
              <p style={styles.killWarning}>ESTA AÇÃO NÃO PODE SER REVERTIDA.</p>
              <div style={styles.modalActions}>
                <button onClick={executeKill} style={styles.confirmBtn}>EXECUTAR_KILL</button>
                <button onClick={() => { playBeep(); setKillTarget(null); }} style={styles.cancelBtn}>ABORTAR</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header style={styles.header}>
        <div style={styles.tabs}>
          <span style={styles.activeTab}>STAT</span><span style={styles.tab}>DATA</span><span style={styles.tab}>MAP</span>
        </div>
        <button onClick={() => { playBeep(); signOut(auth).then(() => navigate('/admin')); }} style={styles.logoutBtn}>
          [ LOGOUT ]
        </button>
      </header>

      <div style={styles.mainScreen}>
        <AnimatePresence>
          {errorMessage && (
            <motion.div 
              initial={{ height: 0, opacity: 0, marginBottom: 0 }} 
              animate={{ height: 'auto', opacity: 1, marginBottom: 20 }} 
              exit={{ height: 0, opacity: 0, marginBottom: 0 }} 
              style={{ overflow: 'hidden' }}
            >
              <div style={styles.errorBanner}><p style={styles.errorText}>{errorMessage}</p></div>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={styles.grid}>
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>// CATEGORIES_DATABASE</h2>
            <div style={styles.inputGroup}>
              <input value={newCategory || ''} onChange={(e) => setNewCategory(e.target.value)} placeholder="NOVA_CLASSE" style={styles.input} />
              <button onClick={handleAddCategory} style={styles.actionBtn}>ADD</button>
            </div>
            <ul style={styles.list}>
              {categories.map(cat => (
                <li key={cat.id} style={styles.listItem}>
                  <span> {cat.nome.toUpperCase()}</span>
                  <button onClick={() => confirmKill("categorias", cat.id, cat.nome)} style={styles.deleteBtnSmall}>[ X ]</button>
                </li>
              ))}
            </ul>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>// ACTIVE_PROJECTS_LOG</h2>
            <div style={styles.scrollArea}>
              {projects.map(proj => (
                <div key={proj.id} style={styles.projectCard}>
                  <div style={{ flex: 1 }}>
                    <div style={styles.projTitle}>{proj.titulo}</div>
                    <div style={styles.projSub}>CLASSE: {proj.categoria}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => startEdit(proj)} style={styles.editBtn}>EDIT</button>
                    <button onClick={() => confirmKill("projetos", proj.id, proj.titulo)} style={styles.deleteBtnSmall}>KILL</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section style={styles.terminalForm}>
          <h2 style={styles.sectionTitle}>{editingId ? `// EDITING: ${editingId}` : "// NEW_PROJECT_ENTRY"}</h2>
          <form onSubmit={handleSaveProject} style={styles.formGrid}>
            <input placeholder="TITLE" value={project.titulo || ''} onChange={e => setProject({...project, titulo: e.target.value})} style={styles.input} />
            <select value={project.categoria || ''} onChange={e => setProject({...project, categoria: e.target.value})} style={styles.input}>
              <option value="">SELECT_CATEGORY</option>
              {categories.map(cat => <option key={cat.id} value={cat.nome}>{cat.nome}</option>)}
            </select>
            <input placeholder="IMAGE_LINK (URL)" value={project.imagemUrl || ''} onChange={e => setProject({...project, imagemUrl: e.target.value})} style={{...styles.input, gridColumn: 'span 2'}} />
            <textarea placeholder="SUMMARY" value={project.resumo || ''} onChange={e => setProject({...project, resumo: e.target.value})} style={{...styles.input, gridColumn: 'span 2', height: '80px'}} />
            <input placeholder="OBJECTIVE" value={project.objective || ''} onChange={e => setProject({...project, objective: e.target.value})} style={styles.input} />
            <input placeholder="AUDIENCE" value={project.paraQuem || ''} onChange={e => setProject({...project, paraQuem: e.target.value})} style={styles.input} />
            
            <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px' }}>
              <button type="submit" style={styles.submitBtn}>{editingId ? "COMMIT_CHANGES" : "EXECUTE_PUBLICATION"}</button>
              {editingId && <button type="button" onClick={cancelEdit} style={{...styles.submitBtn, background: '#444', color: '#fff'}}>ABORT</button>}
            </div>
          </form>
        </section>
      </div>

      <footer style={styles.footer}>
        <span>HP 100/100</span><span>VAULT-TEC OS V.3.0</span><span>RADS 0</span>
      </footer>
    </div>
  );
};


const styles = {
  container: { backgroundColor: '#05070a', color: '#1aff80', minHeight: '100vh', padding: '20px', fontFamily: '"Courier New", Courier, monospace', position: 'relative', overflow: 'hidden' },
  scanlines: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)', backgroundSize: '100% 4px', pointerEvents: 'none', zIndex: 10 },
  header: { borderBottom: '2px solid #1aff80', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px' },
  tabs: { display: 'flex', gap: '30px', fontWeight: 'bold' },
  activeTab: { borderBottom: '4px solid #1aff80', paddingBottom: '5px' },
  tab: { opacity: 0.5 },
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
  submitBtn: { gridColumn: 'span 1', flex: 1, padding: '15px', background: '#1aff80', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer' },
  errorBanner: { background: 'rgba(255, 77, 77, 0.2)', border: '2px solid #ff4d4d', padding: '15px' },
  errorText: { margin: 0, color: '#ff4d4d', fontWeight: 'bold', textAlign: 'center' },
  footer: { marginTop: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 },
  killModal: { width: '400px', padding: '30px', border: '3px solid #ff4d4d', backgroundColor: '#05070a', textAlign: 'center', boxShadow: '0 0 20px #ff4d4d' },
  killTitle: { color: '#ff4d4d', marginBottom: '20px', letterSpacing: '2px' },
  killText: { color: '#1aff80', marginBottom: '10px', lineHeight: '1.5' },
  killWarning: { color: '#ff4d4d', fontSize: '0.7rem', marginBottom: '20px', fontWeight: 'bold' },
  modalActions: { display: 'flex', gap: '20px', justifyContent: 'center' },
  confirmBtn: { padding: '10px 20px', background: '#ff4d4d', color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer' },
  cancelBtn: { padding: '10px 20px', background: 'transparent', color: '#1aff80', border: '1px solid #1aff80', fontWeight: 'bold', cursor: 'pointer' }
};

export default Dashboard;