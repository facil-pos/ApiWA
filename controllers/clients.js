const { Client, LocalAuth } = require('whatsapp-web.js');

const clients = {};
// Crea un cliente para cada número de teléfono
for (let i = 1; i <= 100; i++) {
  const clientId = `client${i}`;
  clients[clientId] = new Client({
    puppeteer: {
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
      ],
    },
    authStrategy: new LocalAuth({ clientId }),
  });
}

module.exports = clients;