const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // nuevo: requerimos la libreria para tokens reales

const app = express();

// configuracion basica para que el frontend pueda hablar con el back
app.use(cors());
app.use(express.json());

const DB_PATH = './users.json';
// llave secreta para firmar los tokens (como el sello de una receta)
const SECRET_KEY = 'mi_llave_secreta_super_segura'; 

// funcion para leer mis usuarios guardados en el json
const readUsers = () => {
    try {
        if (!fs.existsSync(DB_PATH)) return [];
        return JSON.parse(fs.readFileSync(DB_PATH, 'utf8') || '[]');
    } catch (error) { return []; }
};

// funcion para guardar los cambios en mi archivo local
const writeUsers = (users) => fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));

// 1. registro de nuevo usuario (ahora es async para poder encriptar)
app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const users = readUsers();
    
    // verifico que no exista ya para no duplicar
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ message: 'usuario ya registrado' });
    }

    // encripto la contraseña antes de guardarla
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // creo el nuevo usuario con id unico y contraseña protegida
    const newUser = { 
        email, 
        password: hashedPassword, 
        id: `SECURE-${Math.random().toString(36).substr(2, 9).toUpperCase()}` 
    };
    users.push(newUser);
    writeUsers(users);
    
    res.status(201).json({ message: 'registro exitoso' });
});

// 2. inicio de sesion (ahora es async para comparar el hash)
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const users = readUsers();
    
    // busco si el usuario existe por su correo
    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(401).json({ message: 'credenciales invalidas' });
    }
    
    // comparo la contraseña escrita con la encriptada guardada
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'credenciales invalidas' });
    }
    
    // si esta todo ok, genero un token real firmado que dura 1 hora
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    
    res.status(200).json({ session_token: token, email: user.email });
});

// 3. obtener perfil dinamico
app.get('/me', (req, res) => {
    // capturo el token que el frontend manda en la cabecera de autorizacion
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // separa "Bearer [token]"
    
    // si no hay token, rechazo la consulta
    if (!token) return res.status(401).json({ message: 'acceso denegado, falta token' });
    
    try {
        // verifico si el token es valido y fue firmado con mi llave
        const decoded = jwt.verify(token, SECRET_KEY);
        
        // busco al usuario exacto usando el id que viene dentro del token
        const users = readUsers();
        const user = users.find(u => u.id === decoded.id);
        
        if (!user) return res.status(404).json({ message: 'usuario no encontrado' });
        
        // devuelvo los datos que necesito mostrar en el dashboard
        res.status(200).json({ 
            email: user.email, 
            id: user.id 
        });
    } catch (error) {
        // si el token fue alterado o caduco
        return res.status(403).json({ message: 'token invalido o expirado' });
    }
});

// levanto el servidor en el puerto 5000
app.listen(5000, () => console.log('servidor en http://localhost:5000'));