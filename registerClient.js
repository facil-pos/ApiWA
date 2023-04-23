const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'facilpos',
    password: '1234',
    port: 5432
});

router.post('/registerClient', (req, res) => {
    const { name, email, daily_message_quota } = req.body;

    // Validar que daily_message_quota sea un número entero
    const dailyMessageQuota = parseInt(daily_message_quota);
    if (isNaN(dailyMessageQuota)) {
        res.status(400).json({ error: 'daily_message_quota debe ser un número entero' });
        return;
    }

    const query = 'INSERT INTO clients (name, email, daily_message_quota) VALUES ($1, $2, $3) RETURNING *';
    const values = [name, email, dailyMessageQuota];

    pool.query(query, values, (error, result) => {
        if (error) {
            console.log(`Error al registrar al cliente ${name}: ${error}`);
            res.status(500).json({ error: 'Error al registrar al cliente' });
        } else {
            console.log(`Cliente ${name} registrado con éxito`);
            res.status(200).json({ success: 'Cliente registrado con éxito', client: result.rows[0] });
        }
    });
});

module.exports = router;
