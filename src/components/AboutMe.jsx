import React from 'react';

const AboutMe = () => {
  const colors = {
    blue: '#00d2ff',
    purple: '#9d50bb',
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
      flexWrap: 'wrap' // Para ficar responsivo no celular
    }}>
      
      {/* Lado Esquerdo: Foto com Moldura Neon */}
      <div style={{ position: 'relative' }}>
        {/* A moldura azul de trás */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          width: '300px',
          height: '350px',
          border: `3px solid ${colors.blue}`,
          zIndex: 1
        }}></div>

        {/* A Foto (Substitua o link pela sua foto depois) */}
        <div style={{
          position: 'relative',
          width: '300px',
          height: '350px',
          backgroundColor: '#1a1a1a',
          zIndex: 2,
          overflow: 'hidden'
        }}>
          <img 
            src="https://via.placeholder.com/300x350" 
            alt="Sua Foto" 
            style={{ width: '100%', height: '100%', objectCover: 'cover' }}
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
        }}>About Me</h2>
        
        <p style={{ 
          color: '#aaa', 
          lineHeight: '1.6', 
          fontSize: '1.1rem',
          marginBottom: '30px'
        }}>
          Sou um desenvolvedor apaixonado por tecnologia e cibersegurança. 
          Focado em criar soluções robustas, escaláveis e, acima de tudo, seguras. 
          Atualmente desenvolvendo projetos Full S tack com foco em performance e experiênciado usuário.
        </p>

        {/* Botões */}
        <div style={{ display: 'flex', gap: '20px' }}>
          <button style={{
            padding: '12px 30px',
            background: `linear-gradient(to right, ${colors.blue}, ${colors.purple})`,
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>Contrate-me</button>

          <button style={{
            padding: '12px 30px',
            background: 'transparent',
            color: 'white',
            border: '1px solid white',
            borderRadius: '5px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>RESUME</button>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;