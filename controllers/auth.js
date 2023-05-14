const jwt = require('jsonwebtoken');
require('dotenv').config();

// Función para verificar si un usuario está autorizado
function isAuthenticated(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token no válido' });
    }
}

// Función para generar un token JWT
function generateToken(user) {
    const payload = {
        sub: user.id,
        iat: Date.now(),
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });
    return token;
}

module.exports = { isAuthenticated, generateToken };

