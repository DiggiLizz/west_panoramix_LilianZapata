import { signOut } from "firebase/auth"; 
import { auth } from './firebase';      
import { apiClient } from '../services/apiClient';

/**
 * servicio para iniciar sesion.
 */
export const login = async (email, password) => {
  const response = await apiClient.post('/login', { email, password });
  
  if (response.ok && response.data?.session_token) {
    localStorage.setItem('authToken', response.data.session_token);
  }
  
  return response;
};

/**
 * servicio para cerrar sesion.
 */
export const logout = async () => { 
  try {
    // cierra sesion en firebase
    await signOut(auth);
  } catch (error) {
    console.error("error al cerrar sesion en firebase:", error);
  } finally {
    // elimina tokens y datos locales
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole'); 
  }
};