import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../services/apiClient';
import './RegisterPage.css';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState(''); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg(''); 

    // valido la fortaleza basica de la contraseña
    if (password.length < 6) {
      return setError('la contraseña debe tener al menos 6 caracteres.');
    }

    // valido que las contraseñas coincidan
    if (password !== confirmPassword) {
      return setError('las contraseñas no coinciden.');
    }
    
    setIsSubmitting(true);
    try {
      // envio los datos al servidor
      const response = await apiClient.post('/register', { email, password });
      
      if (response.ok) {
        // muestro mensaje amigable en la interfaz y espero 2 segundos para redirigir
        setSuccessMsg('registro exitoso. redirigiendo al login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(response.data?.message || 'error al registrar.');
      }
    } catch (err) {
      setError('error al conectar con el servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="registerContainer">
      <div className="registerCard">
        <h2 className="registerTitle">crear cuenta</h2>
        <p className="registerSubtitle">ingresa tus datos para registrarte.</p>
        
        <form onSubmit={handleRegister} className="registerForm">
          {/* campo de correo */}
          <div className="registerInputGroup">
            <input 
              type="email" 
              placeholder="correo" 
              className="registerInput"
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          
          {/* campo de contraseña */}
          <div className="registerInputGroup">
            <input 
              type="password" 
              placeholder="contraseña (min. 6 caracteres)" 
              className="registerInput"
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          
          {/* campo de confirmacion */}
          <div className="registerInputGroup">
            <input 
              type="password" 
              placeholder="confirmar" 
              className="registerInput"
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="registerButton"
          >
            {isSubmitting ? 'registrando...' : 'registrarse'}
          </button>
        </form>

        {/* caja de error y exito visuales */}
        {error && <p style={{color: 'red', marginTop: '10px'}}>{error}</p>}
        {successMsg && <p style={{color: 'green', marginTop: '10px'}}>{successMsg}</p>}
        
        <div className="registerLoginLinkContainer">
          <Link to="/login" className="registerLoginLink">ya tienes cuenta? inicia sesion</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;