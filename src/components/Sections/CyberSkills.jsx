import React from 'react';

const CyberSkills = () => {
  const skills = ["Pentest", "OWASP Top 10", "Criptografia", "Redes Seguras"];

  return (
    <section id="cyber" style={{ padding: '40px 20px', backgroundColor: '#1a1a1a', color: 'white' }}>
      <h2>🛡️ Conhecimentos de Cyber</h2>
      <ul style={{ display: 'flex', gap: '10px', listStyle: 'none', padding: 0, flexWrap: 'wrap' }}>
        {skills.map(skill => (
          <li key={skill} style={{ background: '#333', padding: '10px 20px', borderRadius: '5px' }}>
            {skill}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default CyberSkills;