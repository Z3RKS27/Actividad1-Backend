const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const SECRET_KEY = 'clave_ultrasecerta_para_practica_aws';

const users = [
    { id: 1, username: 'admin', password: 'password123' }
];

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Credenciales incorrectas' });
    }
});

app.get('/api/dashboard', (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(403).json({ message: 'Token requerido' });
    
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Token inválido o expirado' });
        res.json({ 
            message: `Bienvenido al sistema seguro, ${decoded.username}`, 
            data: 'Información confidencial del sistema distribuido en AWS (Zero Trust)' 
        });
    });
});

app.listen(3001, '0.0.0.0', () => {
    console.log('Backend API corriendo en el puerto 3001');
});
