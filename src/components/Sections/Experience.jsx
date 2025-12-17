import React from 'react';

const Experience = () => {
  const locais = [
    {
      empresa: "Nome da Empresa",
      cargo: "Seu Cargo",
      periodo: "Jan 2023 - Presente",
      atividades: "Desenvolvimento de sistemas e análise de segurança."
    },
    // Você pode adicionar mais objetos aqui depois
  ];

  return (
    <section id="experience" style={{ padding: '40px 20px' }}>
      <h2>💼 Onde Trabalhei</h2>
      {locais.map((job, index) => (
        <div key={index} style={{ marginBottom: '20px', borderLeft: '3px solid #646cff', paddingLeft: '15px' }}>
          <h3>{job.cargo} @ {job.empresa}</h3>
          <span>{job.periodo}</span>
          <p>{job.atividades}</p>
        </div>
      ))}
    </section>
  );
};

export default Experience;