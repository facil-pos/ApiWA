const { Pool } = require('pg');
const bcrypt = require('bcrypt'); 
require('dotenv').config();

// Configuración de la conexión a la base de datos
const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT,
});

async function login(req, res) {
    const { username, password, role } = req.body; // Obtener el parámetro role del cuerpo de la solicitud

    // Verificar que el usuario exista en la base de datos
    const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]); 
    if (user.rows.length === 0) { 
        return res.status(401).send('Nombre de usuario o contraseña incorrectos');
    }

    // Verificar la contraseña del usuario
    const validPassword = await bcrypt.compare(password, user.rows[0].password); //
    if (!validPassword) {
        return res.status(401).send('Nombre de usuario o contraseña incorrectos');
    }

    // Crear una nueva sesión y guardar el ID del usuario y el rol en la sesión
    req.session.user = {
        id: user.rows[0].id,
        role: role // Usar la variable role obtenida del cuerpo de la solicitud
    };
    res.send('Inicio de sesión exitoso');
}

module.exports = {
    login
};