import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { login as apiLogin } from '../services/authService';
import { getUserData } from '../services/userService';
import { auth } from '../services/firebase'; 
import { onAuthStateChanged, signOut } from 'firebase/auth';

export const useAuthValues = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. efecto unificado: escucho firebase y luego verifico sistema local
  useEffect(() => {
    const unsubscribeFirebase = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        // caso: detecto usuario logueado en la nube
        setUser({
          name: firebaseUser.displayName || 'usuario cloud',
          email: firebaseUser.email,
          isCloudUser: true
        });
        setLoading(false);
      } else {
        // caso: no hay usuario en firebase, verifico sistema local
        await checkLocalSession();
      }
    });

    return () => unsubscribeFirebase();
  }, []);

  // funcion para verificar si existe una sesion local guardada
  const checkLocalSession = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const result = await getUserData();
        if (result.ok) {
          setUser(result.data);
        } else {
          localStorage.removeItem('authToken');
          setUser(null);
        }
      } catch (err) {
        console.error('error al validar sesion local:', err);
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  // 2. logica de login tradicional que implemento
  const handleLogin = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiLogin(email, password);
      if (result.ok) {
        localStorage.setItem('authToken', result.data.session_token);
        const profile = await getUserData();
        if (profile.ok) {
          setUser(profile.data);
          return { success: true };
        } else {
          localStorage.removeItem('authToken');
        }
      }
      setError(result.data?.message || 'error al iniciar sesion.');
      return { success: false };
    } catch (err) {
      setError('error de conexion con el servidor.');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // 3. logica de logout unificada para cerrar todo
  const handleLogout = async () => {
    // limpio mi almacenamiento local
    localStorage.removeItem('authToken');
    
    // limpio firebase si detecto sesion activa
    if (auth.currentUser) {
      try {
        await signOut(auth);
      } catch (err) {
        console.error("error al cerrar sesion en firebase:", err);
      }
    }
    
    setUser(null);
    setError(null);
  };

  return {
    user,
    loading,
    error,
    login: handleLogin,
    logout: handleLogout
  };
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useauth debe ser utilizado dentro de un authprovider');
  }
  return context;
};