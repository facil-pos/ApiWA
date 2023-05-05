const express = require('express');
const router = express.Router();
const pool = require('../db/db');
const clients = require('./clients');

router.post('/sendMessage', async (req, res) => {
    const { numbers, message } = req.body;

    // Obtiene el valor de la columna 'client' de la tabla 'users'
    // correspondiente al usuario conectado
    const queryUser = {
        text: 'SELECT client FROM users WHERE username = $1',
        values: [req.session?.user?.username],
    };
    const clientUser = (await pool.query(queryUser))?.rows?.[0]?.client;

    if (!clientUser) {
        console.error(`Cliente no encontrado en la sesión del usuario`);
        return res.status(404).json({ error: `Cliente no encontrado en la sesión del usuario` });
    }

    if (!Array.isArray(numbers) || !numbers.length) {
        console.error(`Los números proporcionados no son válidos`);
        return res.status(400).json({ error: 'Los números proporcionados no son válidos' });
    }

    if (typeof message !== 'string' || !message.trim()) {
        console.error(`El mensaje proporcionado no es válido`);
        return res.status(400).json({ error: 'El mensaje proporcionado no es válido' });
    }

    const numbersString = numbers.join(',');
    const query = {
        text: 'INSERT INTO message(client, numbers, message, created_at, usuario) VALUES($1, $2, $3, $4, $5)',
        values: [clientUser, numbersString, message, new Date(), req.session?.user?.username],
    };    

    try {
        const client = await pool.connect();
        await client.query(query);
        client.release();
        console.log('Mensaje guardado en la base de datos');
        res.status(200).json({ success: 'Mensajes enviados con éxito' });
    } catch (err) {
        console.error('Error al guardar mensaje en la base de datos:', err.stack);
        res.status(500).json({ error: 'Error al guardar mensaje en la base de datos' });
    }

    for (const number of numbers) {
        clients[clientUser].sendMessage(`${number}@c.us`, message);
    }
});

module.exports = router;