import React from 'react';

const ContactForm = () => {
  // Substitua 'SEU_ID_AQUI' pelo ID que o Formspree vai te dar
  const formUrl = "https://formspree.io/f/SEU_ID_AQUI";

  return (
    <section id="contact" style={{ padding: '40px 20px', textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
      <h2>✉️ Entre em Contato</h2>
      <p>Gostou do meu perfil? Mande uma mensagem!</p>
      
      <form action={formUrl} method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Seu E-mail:</label>
          <input 
            type="email" 
            name="email" 
            id="email" 
            required 
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <div>
          <label htmlFor="message" style={{ display: 'block', marginBottom: '5px' }}>Mensagem:</label>
          <textarea 
            name="message" 
            id="message" 
            rows="5" 
            required 
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          ></textarea>
        </div>

        <button 
          type="submit" 
          style={{ 
            backgroundColor: '#646cff', 
            color: 'white', 
            padding: '12px', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Enviar Mensagem
        </button>
      </form>
    </section>
  );
};

export default ContactForm;