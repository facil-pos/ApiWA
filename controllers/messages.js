const express = require('express');
const router = express.Router();
const clients = require('./clients');

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

    res.status(200).json({ success: 'Mensajes enviados con éxito' }); // Envía una respuesta de éxito
});

module.exports = router;


