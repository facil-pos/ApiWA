const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const pool = require('./db/db');
const loginController = require('./controllers/login');
const clients = require('./controllers/clients');
const { generateQrCodes, getQrImage, savedClientId } = require('./controllers/qr');
const messagesRouter = require('./controllers/messages');
const registerRouter = require('./controllers/register');
const usersRouter = require('./routes/usersRouter');

app.use(bodyParser.json());

app.use(session({
    secret: 'clave-secreta',
    resave: false,
    saveUninitialized: true
}));

app.use('/register', registerRouter); 
app.post('/login', loginController.login);
app.post('/logout', loginController.logout);

const requireLogin = (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    } else {
        //el user no esta conectado
        res.redirect('/login');
    }
};
generateQrCodes(clients);

app.get('/qrcode/:clientId', requireLogin, async (req, res) => {
    console.log(savedClientId);
    const clientId = req.params.clientId;
    try {
        const qrImage = await getQrImage(clientId);
        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': qrImage.length,
        });
        res.end(qrImage);
    } catch (error) {
        console.error(error);
        res.sendStatus(404);
    }
    const query = {
        text: 'UPDATE users SET client = $1 WHERE username = $2',
        values: [clientId, req.session?.user?.username],
    };

    try {
        await pool.query(query);
        console.log(`Cliente ${clientId} actualizado para el usuario ${req.session?.user?.username}`);
    } catch (error) {
        console.error(`Error al actualizar el cliente para el usuario ${req.session?.user?.username}: ${error}`);
    }
});

app.use('/users', usersRouter);

app.use(messagesRouter);

app.listen(3000, () => {
    console.log('Servidor ejecutándose en el puerto 3000');
});