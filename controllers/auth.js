const jwt = require('jsonwebtoken');

// Clave secreta para firmar los tokens JWT
const JWT_SECRET = 'secret-key';

// Función para verificar si un usuario está autorizado
function isAuthenticated(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
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

    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

module.exports = { isAuthenticated, generateToken };
