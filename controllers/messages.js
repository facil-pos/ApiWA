const express = require('express');
const router = express.Router();
const pool = require('../db/db');
const clients = require('./clients');

// Obtener el límite máximo de mensajes permitidos por día para el usuario actual
const getMaxMessageLimit = async (username) => {
    const query = {
        text: 'SELECT num_msgs FROM users WHERE username = $1',
        values: [username],
    };
    const result = await pool.query(query);
    const numMsgs = result.rows[0]?.num_msgs || 0;
    return numMsgs;
};

// Verificar si el usuario ha alcanzado su límite diario de mensajes
const hasReachedMessageLimit = async (username) => {
    const query = {
        text: 'SELECT COUNT(*) AS message_count FROM message WHERE usuario = $1 AND created_at >= current_date',
        values: [username],
    };
    const result = await pool.query(query);
    const messageCount = result.rows[0]?.message_count || 0;
    const maxMsgs = await getMaxMessageLimit(username);
    return messageCount >= maxMsgs;
};

router.post('/sendMessage', async (req, res) => {
    const { numbers, message } = req.body;
    const username = req.session?.user?.username;

    const clientUser = (await pool.query({
        text: 'SELECT client FROM users WHERE username = $1',
        values: [username],
    }))?.rows?.[0]?.client;

    if (!clientUser) {
        console.error(`Cliente no encontrado en la sesión del usuario`);
        return res.status(404).json({ error: `Cliente no encontrado en la sesión del usuario` });
    }

    if (await hasReachedMessageLimit(username)) {
        console.error(`El usuario ha alcanzado su límite diario de mensajes`);
        return res.status(400).json({ error: 'Has alcanzado tu límite diario de mensajes' });
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
        values: [clientUser, numbersString, message, new Date(), username],
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