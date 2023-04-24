const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'facilpos',
    password: '1234',
    port: 5432,
});

router.post('/', async (req, res) => {
    const { username, password } = req.body;

    // Verificar que el usuario no exista ya en la base de datos
    const existingUser = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (existingUser.rows.length > 0) {
        return res.status(409).send('El nombre de usuario ya está en uso');
    }

    // Hashear la contraseña del usuario
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insertar el usuario en la base de datos
    try {
        const newUser = await pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', [username, hashedPassword]);
        res.status(201).send(newUser.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error del servidor');
    }
});

module.exports = router;