import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './WelcomePage.css';

const WelcomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // 1. estado para guardar la seleccion del rol del usuario
  const [rol, setRol] = useState('gestor');

  // 2. verifico si el usuario esta logueado, si no, lo mando al login
  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  if (!user) return null;

  // 3. funcion para guardar la preferencia en el localstorage y entrar al dashboard
  const handleConfirm = () => {
    localStorage.setItem('userRole', rol);
    navigate('/dashboard');
  };

  // 4. logica para mostrar el nombre: uso el nombre de perfil o la primera parte del correo
  const nombreParaMostrar = user.name || (user.email ? user.email.split('@')[0] : 'usuario');

  return (
    <div className="welcome-container">
      <div className="welcome-card">
        {/* titulo personalizado con el nombre del usuario */}
        <h1 className="welcome-title">¡hola, {nombreParaMostrar}!</h1>
        
        <p className="welcome-text">valide tu acceso. selecciona tu perfil para continuar.</p>

        <div className="setup-wrapper">
          <label>rol principal:</label>
          {/* selector de rol que actualiza el estado local */}
          <select 
            className="welcome-select" 
            value={rol} 
            onChange={(e) => setRol(e.target.value)}
          >
            <option value="gestor">gestor de eventos</option>
            <option value="tecnico">tecnico de produccion</option>
          </select>
        </div>

        {/* boton de confirmacion que dispara la navegacion al dashboard */}
        <button className="welcome-btn" onClick={handleConfirm}>confirmar y entrar</button>
      </div>
    </div>
  );
};

export default WelcomePage;