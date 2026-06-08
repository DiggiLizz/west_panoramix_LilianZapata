// apunto a mi servidor local de express
const BASE_URL = 'http://localhost:5000'; 

export const apiClient = {
  request: async (endpoint, options = {}) => {
    const url = `${BASE_URL}${endpoint}`;
    const token = localStorage.getItem('authToken');

    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    // si tengo un token, lo agrego a los headers usando el estandar
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      // proceso la respuesta del servidor
      const text = await response.text();
      let data;
      try {
        data = text ? JSON.parse(text) : null;
      } catch (e) {
        data = { message: text }; 
      }

      return {
        ok: response.ok,
        status: response.status,
        data: data
      };
    } catch (error) {
      console.error('error de conexion con el backend:', error);
      return { 
        ok: false, 
        status: 500, 
        data: { message: 'no se pudo conectar con el servidor local.' } 
      };
    }
  },

  // funciones auxiliares para get y post
  get: (endpoint, options = {}) => apiClient.request(endpoint, { ...options, method: 'GET' }),
  
  post: (endpoint, body, options = {}) => 
    apiClient.request(endpoint, { 
      ...options, 
      method: 'POST', 
      body: JSON.stringify(body) 
    }),
};