require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json()); // Soporte para JSON en el cuerpo de las solicitudes

const clients = require('./controllers/clients'); // Importa los clientes
const { generateQrCodes, getQrImage } = require('./controllers/qr'); // Importa las funciones para generar y obtener los códigos QR
const messagesRouter = require('./controllers/messages'); // Importa el router para manejar las solicitudes POST

generateQrCodes(clients); // Genera los códigos QR para cada cliente

// Ruta para obtener la imagen del código QR
app.get('/qrcode/:clientId', async (req, res) => {
    const clientId = req.params.clientId; // Obtiene el ID del cliente de los parámetros de la solicitud

    try {
        const qrImage = await getQrImage(clientId); // Obtiene la imagen del código QR correspondiente al ID del cliente
        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': qrImage.length,
        });
        res.end(qrImage);
    } catch (error) {
        console.error(error);
        res.sendStatus(404); // En caso de error, envía un código 404
    }
});

// Utiliza el router creado en messages.js para manejar las solicitudes POST
app.use(messagesRouter);

app.listen(3000, () => {
    console.log('Servidor ejecutándose en el puerto 3000'); // Se ejecuta cuando el servidor se inicia
});