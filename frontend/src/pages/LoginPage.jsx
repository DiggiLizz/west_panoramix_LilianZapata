import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthForm from '../components/AuthForm'; 
import { validateEmail } from '../utils/validation';
import { signInWithGoogle } from '../services/firebase'; 
import './LoginPage.css'; 

const LoginPage = () => {
  const { user, login, loading, error: authError } = useAuth();
  const [localError, setLocalError] = useState('');
  const navigate = useNavigate();

  // 1. cuando el usuario exista, lo envio a la pagina de bienvenida (el paso previo obligatorio)
  useEffect(() => {
    if (user) {
      navigate('/welcome');
    }
  }, [user, navigate]);

  // 2. logica de login tradicional que implemento
  const handleLoginSubmit = async (email, password) => {
    setLocalError('');
    if (!validateEmail(email)) {
      return setLocalError('por favor ingresa un correo con formato valido.');
    }
    const result = await login(email, password);
    if (result.success) {
      navigate('/welcome'); 
    }
  };

  // 3. logica para manejar el login de google
  const handleGoogleLogin = async () => {
    try {
      setLocalError('');
      await signInWithGoogle();
      // al tener el listener en useauth, el useeffect superior detectara al usuario y navegara solo
    } catch (err) {
      console.error("error en firebase:", err);
      setLocalError('error al iniciar sesion con google.');
    }
  };

  const displayError = localError || authError;

  return (
    <div className="loginContainer">
      <div className="loginCard">
        <h2 className="loginTitle">iniciar sesion</h2>
        
        {/* formulario de autenticacion */}
        <AuthForm onSubmit={handleLoginSubmit} isLoading={loading} />
        
        {/* boton de google que conecta con la nube */}
        <button onClick={handleGoogleLogin} className="googleButton">
          ingresar con google
        </button>
        
        {/* caja de error unificada */}
        {displayError && (
          <div className="loginErrorBox" style={{color: 'red', marginTop: '10px', textAlign: 'center'}}>
            {displayError}
          </div>
        )}
        
        {/* enlace de registro */}
        <div style={{ marginTop: '15px', textAlign: 'center' }}>
          <Link to="/register">no tienes cuenta? registrate</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;