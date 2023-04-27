const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();

const loginController = require('./controllers/login');
const clients = require('./controllers/clients');
const { generateQrCodes, getQrImage } = require('./controllers/qr');
const messagesRouter = require('./controllers/messages');
const registerRouter = require('./controllers/register'); // Importa el enrutador de register

app.use(bodyParser.json());

app.use(session({
    secret: 'clave-secreta',
    resave: false,
    saveUninitialized: true
}));

app.use('/register', registerRouter); // Utiliza el enrutador de register en la ruta /register

app.post('/login', loginController.login); // Utiliza la función de login importada

const requireLogin = (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

generateQrCodes(clients); 

app.get('/qrcode/:clientId', requireLogin, async (req, res) => {
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

app.use(messagesRouter);

app.listen(3000, () => {
    console.log('Servidor ejecutándose en el puerto 3000');
});