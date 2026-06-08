import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LogoutButton from '../components/LogoutButton';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // 1. estados para controlar el rol seleccionado y la vista del panel activo
  const [rol, setRol] = useState('');
  const [panelActivo, setPanelActivo] = useState(null);

  // 2. seguridad: verifico que exista un rol, si no, redirijo a la bienvenida
  useEffect(() => {
    const storedRol = localStorage.getItem('userRole');
    if (!storedRol) {
      navigate('/welcome');
      return;
    }
    setRol(storedRol);
  }, [navigate]);

  // 3. verifico si el usuario existe para evitar errores durante la carga
  if (!user) return <div className="dashLayout"><p style={{color: 'white', padding: '2rem'}}>cargando...</p></div>;

  // 4. extraigo el nombre desde el perfil o desde el correo
  const userName = user.name || user.email.split('@')[0];

  // 5. funcion para cambiar el rol y limpiar el panel activo
  const handleRolChange = (newRol) => {
    setRol(newRol);
    setPanelActivo(null);
    localStorage.setItem('userRole', newRol);
  };

  return (
    <div className="dashLayout">
      <nav className="dashNavbar">
        <h2>bio-logical app</h2>
        
        {/* selector de rol para cambiar de vista en tiempo real */}
        <select 
          value={rol} 
          onChange={(e) => handleRolChange(e.target.value)} 
          style={{ padding: '8px', marginLeft: '20px', cursor: 'pointer' }}
        >
          <option value="gestor">modo: gestión</option>
          <option value="tecnico">modo: técnico</option>
        </select>
        
        <LogoutButton />
      </nav>

      <main className="dashMain">
        <header className="dashHeader">
          <h1>hola, {userName}</h1>
          <p>panel de {rol === 'tecnico' ? 'producción técnica' : 'gestión logística'}</p>
        </header>

        {/* 6. renderizado dinamico: cambio el contenido segun si hay un panel abierto */}
        {panelActivo ? (
          <section className="dashDetailView" style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '12px', color: '#1e293b' }}>
            <button onClick={() => setPanelActivo(null)} style={{ marginBottom: '20px', cursor: 'pointer' }}>← volver al panel</button>
            <h2>{panelActivo === 'planificador' ? 'planificador de eventos' : 'consola técnica'}</h2>
            <p>{panelActivo === 'planificador' ? 'aqui visualizo mis eventos.' : 'aqui controlo luces y audio.'}</p>
          </section>
        ) : (
          /* 7. si no hay panel activo, muestro las tarjetas de opciones */
          <section className="dashGrid">
            {rol === 'gestor' ? (
              <div className="dashCard" style={{ border: '2px solid #10b981' }}>
                <h3>módulo de gestión</h3>
                <button className="dashButton" onClick={() => setPanelActivo('planificador')}>abrir planificador</button>
              </div>
            ) : (
              <div className="dashCard" style={{ border: '2px solid #3b82f6', backgroundColor: '#eff6ff', color: '#1e293b' }}>
                <h3 style={{ color: '#1e293b' }}>consola técnica</h3>
                <button className="dashButton" onClick={() => setPanelActivo('consola')}>iniciar consola</button>
              </div>
            )}
            
            <div className="dashCard">
              <h3>estado de seguridad</h3>
              <p>● sesión activa</p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;