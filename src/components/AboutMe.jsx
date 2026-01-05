import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaUniversity, 
  FaAward, 
  FaTerminal 
} from "react-icons/fa";

const AboutMe = () => {
  const colors = {
    blue: '#00d2ff',
    purple: '#9d50bb',
  };

  // Estilo para o container de cada item da trajetória
  const itemContainerStyle = {
    marginBottom: '25px',
    display: 'flex',
    flexDirection: 'column', // Empilha o título e o texto alinhados
    alignItems: 'flex-start',
    gap: '5px'
  };

  const titleHeaderStyle = {
    color: colors.blue,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '1.05rem'
  };

  const descriptionStyle = {
    color: '#ccc',
    paddingLeft: '28px', // Alinha o texto exatamente abaixo do início do título (ajuste conforme o tamanho do ícone)
    lineHeight: '1.6',
    fontSize: '0.95rem'
  };

  return (
    <section id="about" style={styles.section}>
      {/* Lado Esquerdo: Foto com Moldura Neon */}
      <div style={styles.photoContainer}>
        <div style={styles.neonFrame}></div>
        <div style={styles.photoWrapper}>
          <img 
            src="src/assets/canvas.png" 
            alt="Igor Lima" 
            style={styles.image}
          />
        </div>
      </div>

      {/* Lado Direito: Conteúdo e Biografia */}
      <div style={styles.contentArea}>
        <h2 style={styles.mainTitle}>
          Sobre <span style={styles.highlight}>Mim</span>
        </h2>
        
        <div style={styles.bioText}>
          <p style={styles.introParagraph}>
            Desenvolvedor apaixonado por criar experiências onde a <strong>criatividade</strong> e a <strong>interatividade</strong> se encontram. 
            Com formação voltada para a <strong>Engenharia de Computação</strong>, transito entre o desenvolvimento web e a criação de jogos.
          </p>

          <strong style={styles.subHeader}>Trajetória Técnica:</strong>

          {/* Item: Liderança CIMATEC */}
          <div style={itemContainerStyle}>
            <div style={titleHeaderStyle}><FaAward /> • Liderança CIMATEC Jr:</div> 
            <div style={descriptionStyle}>
              Atuei como Diretor de Marketing e Coordenador de Capacitações. Premiado como <strong>Trainee Destaque Qualidade</strong> além  de integrar o time de projetistas de desenvolvimento.
            </div>
          </div>

          {/* Item: Experiência Governamental */}
          <div style={itemContainerStyle}>
            <div style={titleHeaderStyle}><FaUniversity /> • GOV MGI:</div> 
            <div style={descriptionStyle}>
              Estagiário no <strong>Ministério da Gestão e da Inovação</strong>, otimizando o rendimento interno da equipe através de soluções customizadas.
            </div>
          </div>

          {/* Item: Projetos Autorais */}
          <div style={itemContainerStyle}>
            <div style={titleHeaderStyle}><FaTerminal /> • UPIXEL STUDIOS:</div> 
            <div style={descriptionStyle}>
              Meu projeto de criação de uma desenvolvedora de experiencias interativas em 3D/2D usando Unity como principal ferramenta.
            </div>
          </div>          
        </div>

      </div>
    </section>
  );
};

// Objeto de estilos consolidado para organização
const styles = {
  section: { display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '80px', padding: '100px 50px', maxWidth: '1200px', margin: '0 auto', flexWrap: 'wrap' },
  photoContainer: { position: 'relative' },
  neonFrame: { position: 'absolute', top: '20px', left: '20px', width: '300px', height: '350px', border: `3px solid #00d2ff`, zIndex: 1, boxShadow: `0 0 10px #00d2ff, 0 0 20px #00d2ff inset, 0 0 30px #00d2ff` },
  photoWrapper: { position: 'relative', width: '300px', height: '350px', backgroundColor: '#0a0a0a', zIndex: 2, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: `0 0 15px rgba(0, 210, 255, 0.3)` },
  image: { width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 },
  contentArea: { flex: 1, minWidth: '350px' },
  mainTitle: { fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '25px', textTransform: 'uppercase', letterSpacing: '2px' },
  highlight: { color: '#00d2ff', textShadow: `0 0 10px #00d2ff` },
  bioText: { color: '#ccc', lineHeight: '1.8', fontSize: '1rem', marginBottom: '30px', textAlign: 'justify' },
  introParagraph: { marginBottom: '25px', color: '#fff', borderLeft: `3px solid #00d2ff`, paddingLeft: '15px' },
  subHeader: { color: '#fff', fontSize: '1.1rem', display: 'block', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' },
  ctaButton: { padding: '12px 35px', background: `linear-gradient(to right, #00d2ff, #9d50bb)`, color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'monospace', boxShadow: `0 0 10px rgba(0, 210, 255, 0.4)` }
};

export default AboutMe;