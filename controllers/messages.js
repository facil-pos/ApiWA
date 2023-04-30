const express = require('express');
const router = express.Router();
const clients = require('./clients');
/* const { Pool } = require('pg'); */
require('dotenv').config();

const pool = require('../db/db');

/* const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT,
}); */

const requireLogin = (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

router.post('/sendMessage', requireLogin, (req, res) => {
    const { client, numbers, message } = req.body; // Obtiene los datos del cuerpo de la solicitud

    if (!clients[client]) {
        console.log(`Cliente ${client} no encontrado`); // Se ejecuta cuando el cliente no se encuentra
        res.status(404).json({ error: `Cliente ${client} no encontrado` }); // Envía una respuesta de error
        return;
    }

    for (const number of numbers) {
        clients[client].sendMessage(`${number}@c.us`, message); // Envia el mensaje
    }
    const query = {
        text: 'INSERT INTO message(client, numbers, message, created_at, updated_at, usuario) VALUES($1, $2, $3, $4, $5, $6)',
        values: [client, numbers.join(','), message, new Date(), new Date(), req.session.user.username],
    };
    pool.connect((err, client, done) => {
        if (err) throw err;

        client.query(query, (err) => {
            done();
            if (err) {
                console.log(err.stack);
                res.status(500).json({ error: 'Error al guardar mensaje en la base de datos' });
            } else {
                console.log('Mensaje guardado en la base de datos');
                res.status(200).json({ success: 'Mensajes enviados con éxito' });
            }
        });
    });
});

module.exports = router;