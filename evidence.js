/* INDEX */

/* app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Verificar que el usuario exista en la base de datos
    const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (user.rows.length === 0) {
        return res.status(401).send('Nombre de usuario o contraseña incorrectos');
    }

    // Verificar la contraseña del usuario
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
        return res.status(401).send('Nombre de usuario o contraseña incorrectos');
    }

    res.send('Inicio de sesión exitoso');
}); */

/* ----------------------------------------------- */

// Ruta para obtener la imagen del código QR
/* app.get('/qrcode/:clientId', async (req, res) => {
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
}); */

/* -------------------------------------------------- */

/* app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Verificar que el usuario no exista ya en la base de datos
    const existingUser = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (existingUser.rows.length > 0) {
        return res.status(409).send('El nombre de usuario ya está en uso');
    }

    // Hashear la contraseña del usuario
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insertar el usuario en la base de datos
    try {
        const newUser = await pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', [username, hashedPassword]);
        res.status(201).send(newUser.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error del servidor');
    }
}); */
/* FIN INDEX */

/* INDEX 2 COMPELTO */
/* const express = require('express');
const session = require('express-session'); // importar express-session
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json()); // Soporte para JSON en el cuerpo de las solicitudes

// Agregar el middleware express-session
app.use(session({
    secret: 'clave-secreta',
    resave: false,
    saveUninitialized: true
}));


const clients = require('./controllers/clients'); // Importa los clientes
const { generateQrCodes, getQrImage } = require('./controllers/qr'); // Importa las funciones para generar y obtener los códigos QR
const messagesRouter = require('./controllers/messages'); // Importa el router para manejar las solicitudes POST

const auth = require('./controllers/auth');

const { Pool } = require('pg');

// Configuración de la conexión a la base de datos
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'facilpos',
    password: '1234',
    port: 5432,
});

const bcrypt = require('bcrypt');

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Verificar que el usuario no exista ya en la base de datos
    const existingUser = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (existingUser.rows.length > 0) {
        return res.status(409).send('El nombre de usuario ya está en uso');
    }

    // Hashear la contraseña del usuario
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insertar el usuario en la base de datos
    try {
        const newUser = await pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', [username, hashedPassword]);
        res.status(201).send(newUser.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error del servidor');
    }
});


app.post('/login', async (req, res) => {
    const { username, password, role } = req.body; // Obtener el parámetro role del cuerpo de la solicitud

    // Verificar que el usuario exista en la base de datos
    const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (user.rows.length === 0) {
        return res.status(401).send('Nombre de usuario o contraseña incorrectos');
    }

    // Verificar la contraseña del usuario
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
        return res.status(401).send('Nombre de usuario o contraseña incorrectos');
    }

    // Crear una nueva sesión y guardar el ID del usuario y el rol en la sesión
    req.session.user = {
        id: user.rows[0].id,
        role: role // Usar la variable role obtenida del cuerpo de la solicitud
    };
    res.send('Inicio de sesión exitoso');
});

// Middleware que verifica si el usuario ha iniciado sesión
const requireLogin = (req, res, next) => {
    if (req.session && req.session.user) {
        // Si el usuario ha iniciado sesión, permite el acceso
        next();
    } else {
        // Si el usuario no ha iniciado sesión, redirige a la página de inicio de sesión
        res.redirect('/login');
    }
};

generateQrCodes(clients); // Genera los códigos QR para cada cliente

// Ruta para obtener la imagen del código QR
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

// Utiliza el router creado en messages.js para manejar las solicitudes POST
app.use(messagesRouter);

app.listen(3000, () => {
    console.log('Servidor ejecutándose en el puerto 3000'); // Se ejecuta cuando el servidor se inicia
}); */

/* FIN INDEX 2 COMPELTO */

/* messages.js 26/4 */
/* const express = require('express');
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

module.exports = router; */


//MESSAGE.JS 29/4

    /* const query = {
        text: 'INSERT INTO message(client, numbers, message, created_at, updated_at) VALUES($1, $2, $3, $4, $5)',
        values: [client, numbers.join(','), message, new Date(), new Date()],
    }; */

    //MESSAGE.JS 3/5
    /* const express = require('express');
const router = express.Router();
const pool = require('../db/db');
const clients = require('./clients');

router.post('/sendMessage', async (req, res) => {
    const { client, numbers, message } = req.body;

    if (!client) {
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
        values: [client, numbersString, message, new Date(), req.session?.user?.username],
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
        clients[client].sendMessage(`${number}@c.us`, message);
    }
});

module.exports = router; */








/* const express = require('express');
const router = express.Router();
const clients = require('./clients');
require('dotenv').config();
const pool = require('../db/db');

const requireLogin = (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

router.post('/sendMessage', requireLogin, (req, res) => {
    const { client, numbers, message } = req.body; 

    if (!clients[client]) {
        console.log(`Cliente ${client} no encontrado`); 
        res.status(404).json({ error: `Cliente ${client} no encontrado` }); 
        return;
    }
    for (const number of numbers) {
        clients[client].sendMessage(`${number}@c.us`, message); // Envia el mensaje
    }
    const query = {
        text: 'INSERT INTO message(client, numbers, message, created_at, usuario) VALUES($1, $2, $3, $4, $5)',
        values: [client, numbers.join(','), message, new Date(), req.session.user.username],
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

module.exports = router; */



//message.js 7/5
/* const express = require('express');
const router = express.Router();
const pool = require('../db/db');
const clients = require('./clients');

router.post('/sendMessage', async (req, res) => {
    const { numbers, message } = req.body;
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
module.exports = router; */

//index.js 7/5
/* const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const pool = require('./db/db');
const loginController = require('./controllers/login');
const clients = require('./controllers/clients');
const { generateQrCodes, getQrImage, savedClientId } = require('./controllers/qr');
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

const requireLogin = (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    } else {
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
        text: 'UPDATE users SET client = $1, updated_at = NOW() WHERE username = $2',
        values: [clientId, req.session?.user?.username],
    };

    try {
        await pool.query(query);
        console.log(`Cliente ${clientId} actualizado para el usuario ${req.session?.user?.username}`);
    } catch (error) {
        console.error(`Error al actualizar el cliente para el usuario ${req.session?.user?.username}: ${error}`);
    }
});

app.use('/user', userRouter);
app.use('/users', usersRouter);

app.use(messagesRouter);

module.exports = requireLogin;

app.listen(3000, () => {
    console.log('Servidor ejecutándose en el puerto 3000');
}); */

//QR 8/5
/* const qrcode = require('qrcode');
const qrCodes = {};

function generateQrCodes(clients) { 
  for (const [clientId, client] of Object.entries(clients)) {  // Recorre el objeto clients
    client.on('qr', (qr) => { 
      qrCodes[clientId] = qr; 
      console.log(`QR ${clientId}`); // Muestra en consola el ID del cliente

    });
    client.on('ready', () => {
      console.log(`${clientId} Conectado con Exito!`);
    });

    client.initialize();
  }
}

async function getQrImage(clientId) {
  if (!qrCodes[clientId]) {
    throw new Error('QR code not found');
  }

  const qrImage = await qrcode.toBuffer(qrCodes[clientId], { scale: 4 });
  return qrImage;
}
module.exports = { generateQrCodes, getQrImage }; */