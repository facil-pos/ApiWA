const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');

const clients = {
    client1: new Client({
        authStrategy: new LocalAuth({ clientId: 'client1' }),
    }),
    client2: new Client({
        authStrategy: new LocalAuth({ clientId: 'client2' }),
    }),
    client3: new Client({
        authStrategy: new LocalAuth({ clientId: 'client3' }),
    }),
    client4: new Client({
        authStrategy: new LocalAuth({ clientId: 'client4' }),
    }),
    client5: new Client({
        authStrategy: new LocalAuth({ clientId: 'client5' }),
    }),
    client6: new Client({
        authStrategy: new LocalAuth({ clientId: 'client6' }),
    }),
    client7: new Client({
        authStrategy: new LocalAuth({ clientId: 'client7' }),
    }),
    client8: new Client({
        authStrategy: new LocalAuth({ clientId: 'client8' }),
    }),
    client9: new Client({
        authStrategy: new LocalAuth({ clientId: 'client9' }),
    }),
    client10: new Client({
        authStrategy: new LocalAuth({ clientId: 'client10' }),
    }),
};

let qrCodes = {}; // Almacena los códigos QR generados por cada cliente

for (const [clientId, client] of Object.entries(clients)) {
    client.on('qr', (qr) => {
        qrCodes[clientId] = qr; // Almacena el código QR en la variable qrCodes
        console.log(`QR ${clientId}`);
    });

    client.on('ready', () => {
        console.log(`${clientId} Conectado con Exito!`);
    });

    client.initialize();
}

// Ruta para obtener la imagen del código QR
app.get('/qrcode/:clientId', async (req, res) => {
    const clientId = req.params.clientId;

    if (!qrCodes[clientId]) {
        res.sendStatus(404);
        return;
    }

    try {
        // Genera la imagen del código QR utilizando el paquete qrcode
        const qrImage = await qrcode.toBuffer(qrCodes[clientId], { scale: 4 });
        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': qrImage.length,
        });
        res.end(qrImage);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

// Maneja las solicitudes POST para enviar mensajes
app.post('/sendMessage', (req, res) => {
    const { client, numbers, message } = req.body;
    
    if (!clients[client]) {
        console.log(`Cliente ${client} no encontrado`);
        res.status(404).json({ error: `Cliente ${client} no encontrado` });
        return;
    }

    for (const number of numbers) {
        clients[client].sendMessage(`${number}@c.us`, message);
    }

    res.status(200).json({ success: 'Mensajes enviados con éxito' });
});

app.listen(3000, () => {
    console.log('Servidor ejecutándose en el puerto 3000');
});


//ALTERNATIVA
/* const express = require('express');
const bodyParser = require('body-parser');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');

const app = express();
app.use(bodyParser.json());

const clientIds = []; // Aquí agregas los IDs de tus clientes

const clients = {};
for (const clientId of clientIds) {
    clients[clientId] = new Client({
        authStrategy: new LocalAuth({ clientId: clientId }),
    });
}

let qrCodes = {}; // Almacena los códigos QR generados por cada cliente

for (const clientId of clientIds) {
    qrCodes[clientId] = '';
}

for (const clientId of clientIds) {
    clients[clientId].on('qr', (qr) => {
        qrCodes[clientId] = qr; // Almacena el código QR en la variable qrCodes
        console.log(`QR ${clientId}`);
    });

    clients[clientId].on('ready', () => {
        console.log(`${clientId} Conectado con Exito!`);
    });

    clients[clientId].initialize();
}

// Ruta para obtener la imagen del código QR
app.get('/qrcode/:clientId', async (req, res) => {
    const clientId = req.params.clientId;

    if (!qrCodes[clientId]) {
        res.sendStatus(404);
        return;
    }

    try {
        // Genera la imagen del código QR utilizando el paquete qrcode
        const qrImage = await qrcode.toBuffer(qrCodes[clientId], { scale: 10 });
        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': qrImage.length,
        });
        res.end(qrImage);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

// Maneja las solicitudes POST para enviar mensajes
app.post('/sendMessage', (req, res) => {
    const { client, numbers, message } = req.body;

    if (!clients[client]) {
        console.log(`Cliente ${client} no encontrado`);
        res.status(404).json({ error: `Cliente ${client} no encontrado` });
        return;
    }

    for (const number of numbers) {
        clients[client].sendMessage(`${number}@c.us`, message);
    }

    res.status(200).json({ success: 'Mensajes enviados con éxito' });
});

app.listen(3000, () => {
    console.log('Servidor ejecutándose en el puerto 3000');
}); */
