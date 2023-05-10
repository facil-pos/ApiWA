const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const pool = require('./db/db');
const loginController = require('./controllers/login');
const clients = require('./controllers/clients');
const { generateQrCodes, getQrImage } = require('./controllers/qr');
const messagesRouter = require('./controllers/messages');
const registerRouter = require('./controllers/register');
const userRouter = require('./routes/userRouter');
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
app.post('/disableUser', loginController.disableUser);
app.post('/enableUser', loginController.enableUser);

const requireLogin = require('./middleware/requireLogin');
/* const requireLogin = (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}; */
generateQrCodes(clients);

app.get('/qrcode/:clientId', requireLogin, async (req, res) => {
    /* console.log(savedClientId); */
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

app.use('/user', userRouter);
app.use('/users', usersRouter);

app.use(messagesRouter);

/* module.exports = requireLogin; */

app.listen(3000, () => {
    console.log('Servidor ejecutándose en el puerto 3000');
});