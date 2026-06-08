import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// importo las paginas
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import WelcomePage from './pages/WelcomePage'; 
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    // envuelvo toda la aplicacion con el proveedor de autenticacion
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* redireccion inicial: si entro a la raiz, mando a login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* rutas publicas que no requieren sesion */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* ruta de bienvenida: protegida, requiere usuario logueado */}
          <Route 
            path="/welcome" 
            element={
              <ProtectedRoute>
                <WelcomePage />
              </ProtectedRoute>
            } 
          />

          {/* ruta del dashboard: protegida, requiere usuario logueado */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          
          {/* manejo de rutas no definidas: redirecciono a login por seguridad */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;