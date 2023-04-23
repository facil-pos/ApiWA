const express = require('express');
const registerClients = require('./registerClient');
const app = express();

app.use(express.json()); // parsear el body como JSON
app.use(registerClients); // usar las rutas del archivo registerClients.js

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`);
});
