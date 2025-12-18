import React from 'react';
import { motion } from 'framer-motion';

const AboutMe = () => {
  const colors = {
    blue: '#00d2ff',
    purple: '#9d50bb',
  };

  const itemStyle = {
    marginBottom: '15px',
    display: 'block'
  };

  const titleBagagemStyle = {
    color: colors.blue,
    fontWeight: 'bold',
    marginRight: '5px'
  };

  return (
    <section id="about" style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '80px',
      padding: '100px 50px',
      maxWidth: '1100px',
      margin: '0 auto',
      flexWrap: 'wrap'
    }}>
      
      {/* Lado Esquerdo: Foto com Moldura Neon */}
      <div style={{ position: 'relative' }}>
        {/* Moldura com efeito Neon */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          width: '300px',
          height: '350px',
          border: `3px solid ${colors.blue}`,
          zIndex: 1,
          // Aqui está a mágica do Neon
          boxShadow: `0 0 10px ${colors.blue}, 0 0 20px ${colors.blue} inset, 0 0 30px ${colors.blue}`
        }}></div>

        {/* Foto com Glow interno */}
        <div style={{
          position: 'relative',
          width: '300px',
          height: '350px',
          backgroundColor: '#1a1a1a',
          zIndex: 2,
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.1)',
          // Brilho sutil na imagem também
          boxShadow: `0 0 15px rgba(0, 210, 255, 0.3)`
        }}>
          <img 
            src="https://via.placeholder.com/300x350" 
            alt="Sua Foto" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>

      {/* Lado Direito: Texto */}
      <div style={{ flex: 1, minWidth: '300px' }}>
        <h2 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          marginBottom: '20px',
          textTransform: 'uppercase' 
        }}>Sobre <span style={{ 
          color: colors.blue,
          textShadow: `0 0 10px ${colors.blue}` // Neon no título tbm
        }}>Mim</span></h2>
        
        <div style={{ 
          color: '#aaa', 
          lineHeight: '1.7', 
          fontSize: '1.05rem',
          marginBottom: '30px',
          textAlign: 'justify'
        }}>
          <p style={{ marginBottom: '20px', color: '#fff' }}>
            Desenvolvedor apaixonado por criar experiências digitais onde a <strong>segurança</strong> e a <strong>interatividade</strong> se encontram. Com um pé no <strong>Desenvolvimento Web</strong> e outro em <strong>Game Dev</strong>, foco em construir aplicações robustas, escaláveis e, acima de tudo, seguras.
          </p>

          <strong style={{ color: '#fff', fontSize: '1.2rem', display: 'block', marginBottom: '15px' }}>
            O que trago na bagagem:
          </strong>

          <span style={itemStyle}>
            <span style={titleBagagemStyle}>• Liderança Técnica:</span> 
            Fui Diretor e Coordenador na <strong>CIMATEC Jr.</strong>, onde liderei a formação técnica de novos talentos.
          </span>

          <span style={itemStyle}>
            <span style={titleBagagemStyle}>• Excelência na Entrega:</span> 
            Premiado como <strong>Trainee Destaque</strong>, reflexo do meu compromisso com a qualidade e o detalhismo em cada projeto.
          </span>

          <span style={itemStyle}>
            <span style={titleBagagemStyle}>• Versatilidade:</span> 
            Do front-end seguro às mecânicas de jogos, busco sempre a fronteira entre <strong>performance</strong> e <strong>proteção de dados</strong>.
          </span>
        </div>

        {/* Botões com Neon */}
        <div style={{ display: 'flex', gap: '20px' }}>
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: `0 0 20px ${colors.blue}` }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '12px 30px',
              background: `linear-gradient(to right, ${colors.blue}, ${colors.purple})`,
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: `0 0 10px rgba(0, 210, 255, 0.5)`
            }}>Contrate-me</motion.button>

          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)', boxShadow: `0 0 15px white` }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '12px 30px',
              background: 'transparent',
              color: 'white',
              border: '1px solid white',
              borderRadius: '5px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>RESUME</motion.button>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;