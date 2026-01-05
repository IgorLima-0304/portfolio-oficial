import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Páginas Públicas
import Home from './pages/Home'; // Seu portfólio principal
import Blog from './pages/Blog'; // A listagem de notícias que vamos criar
import PostDetail from './pages/PostDetail'; // O post individual
import AdminLogin from './pages/AdminLogin';

// Área Administrativa
import Dashboard from './pages/Dashboard';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<PostDetail />} />
      <Route path="/admin" element={<AdminLogin />} />

      {/* Rotas Protegidas (Dashboard e Gerenciamento) */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />

      {/* Fallback: Redireciona rotas inexistentes para a Home */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;