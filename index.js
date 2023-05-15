const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const pool = require('./db/db');
const clients = require('./controllers/clients');
const { generateQrCodes, getQrImage } = require('./controllers/qrController');
const requireLoginAdmin = require('./middleware/requireLoginAdmin');
const requireLogin = require('./middleware/requireLogin');
/* const auth = require('./controllers/auth'); */
require('./controllers/auth');
require('dotenv').config();
const routes = require('./routes/apiRoutes');

app.use(bodyParser.json());

// Configuración de la sesión
app.use(session({
    secret: process.env.JWT_SECRET, // Clave secreta para firmar el ID de la sesión
    resave: false, // No guardar la sesión en cada petición
    saveUninitialized: true // Guardar una sesión aunque no se inicialice
}));

app.use('/', routes); // Rutas de la API

generateQrCodes(clients);

app.get('/qrcode/:clientId', requireLogin, async (req, res) => {
    const clientId = req.params.clientId;
    const checkDuplicateQuery = {
        text: 'SELECT COUNT(*) FROM users WHERE client = $1',
        values: [clientId],
    };

    try {
        const result = await pool.query(checkDuplicateQuery);
        const duplicateCount = result.rows[0].count;

        if (duplicateCount > 0) {
            const clearPreviousClientQuery = {
                text: 'UPDATE users SET client = NULL, updated_at = NOW() WHERE client = $1',
                values: [clientId],
            };
            await pool.query(clearPreviousClientQuery);
        }
        const updateClientQuery = {
            text: 'UPDATE users SET client = $1, updated_at = NOW() WHERE username = $2',
            values: [clientId, req.session?.user?.username],
        };
        await pool.query(updateClientQuery);
        console.log(`Cliente ${clientId} actualizado para el usuario ${req.session?.user?.username}`);

        const qrImage = await getQrImage(clientId);
        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': qrImage.length,
        });
        res.end(qrImage);
    } catch (error) {
        console.error(`Error al actualizar el cliente para el usuario ${req.session?.user?.username}: ${error}`);
        res.sendStatus(500);
    }
});

app.listen(process.env.PORT, () => {
    console.log('Servidor ejecutándose en el puerto 3000');
});