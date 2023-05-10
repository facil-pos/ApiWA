const { Client, LocalAuth } = require('whatsapp-web.js');

// Crea un cliente para cada número de teléfono
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
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--shm-size=3gb'
      ],
    },
    ignoreHTTPSErrors: true,
    authStrategy: new LocalAuth({ clientId }),
  });
}

module.exports = clients;