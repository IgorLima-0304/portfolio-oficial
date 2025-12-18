import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Escuta se o usuário está logado ou não
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ backgroundColor: '#05070a', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#00ff00', fontFamily: 'monospace' }}>
         VERIFICANDO_AUTORIZACAO...
      </div>
    );
  }

  // Se não houver usuário, redireciona para o login
  if (!user) {
    return <Navigate to="/admin" />;
  }

  return children;
};

export default ProtectedRoute;