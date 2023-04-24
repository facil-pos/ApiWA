const { Client, LocalAuth } = require('whatsapp-web.js');

const clients = {};

// Crea un cliente para cada número de teléfono
for (let i = 1; i <= 2; i++) {
  const clientId = `client${i}`;
  clients[clientId] = new Client({
    authStrategy: new LocalAuth({ clientId }),
  });
}

module.exports = clients;