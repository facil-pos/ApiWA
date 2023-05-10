const bcrypt = require('bcrypt');
require('dotenv').config();
const pool = require('../db/db');

//Iniciar sesión
async function login(req, res) {
    const { username, password, role } = req.body; 
    const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (user.rows.length === 0) {
        return res.status(401).send('Nombre de usuario o contraseña incorrectos');
    }
    
    if (user.rows[0].disabled) {
        return res.status(401).send('Usuario inhabilitado');
    }
    
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
        return res.status(401).send('Nombre de usuario o contraseña incorrectos');
    }
    
    req.session.user = {
        id: user.rows[0].id,
        role: role,
        username: username
    };
    
    res.send('Inicio de sesión exitoso');
}

//Desactivar usuario
async function disableUser(req, res) { 
    const { username } = req.body;
    
    try {
        const result = await pool.query('UPDATE users SET disabled = true WHERE username = $1', [username]);
        
        if (result.rowCount === 0) {
            return res.status(404).send('Usuario no encontrado');
        }
        
        res.send('Usuario inhabilitado correctamente');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al inhabilitar el usuario');
    }
}

//Activar usuario
async function enableUser(req, res) {
    const { username } = req.body;
    
    try {
        const result = await pool.query('UPDATE users SET disabled = false WHERE username = $1', [username]);
        
        if (result.rowCount === 0) {
            return res.status(404).send('Usuario no encontrado');
        }
        
        res.send('Usuario habilitado correctamente');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al habilitar el usuario');
    }
}

//Cerrar sesión
async function logout(req, res) {
    const username = req.session.user.username;
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error al cerrar sesión');
        } else {
            res.send(`Sesión cerrada de ${username} exitosamente`);
        }
    });
}

module.exports = {
    login,
    logout,
    disableUser,
    enableUser
};