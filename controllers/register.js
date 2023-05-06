const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
require('dotenv').config();
const pool = require('../db/db');

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
    const numMsgs = 50;

    // Insertar el usuario en la base de datos
    try {
        const newUser = await pool.query('INSERT INTO users (username, password, num_msgs, created_at) VALUES ($1, $2, $3, $4) RETURNING *', [username, hashedPassword, numMsgs, new Date()]);
        res.status(201).send(newUser.rows[0]); 
    } catch (err) {
        console.error(err);
        res.status(500).send('Error del servidor');
    }
});

module.exports = router;
