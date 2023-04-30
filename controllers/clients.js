/* const { Client, LocalAuth } = require('whatsapp-web.js');

const clients = {};

// Crea un cliente para cada número de teléfono
for (let i = 1; i <= 2; i++) {
  const clientId = `client${i}`;
  clients[clientId] = new Client({
    authStrategy: new LocalAuth({ clientId }),
  });
}

module.exports = clients; */

//PARA LOCAL
const { Client, LocalAuth } = require('whatsapp-web.js');
const clients = {};
for (let i = 1; i <= 50; i++) {
  const clientId = `client${i}`;
  clients[clientId] = new Client({
    authStrategy: new LocalAuth({ clientId }),    
    puppeteer: {
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
  });

}
module.exports = clients;


//PARA SERVIDOR
/* const { Client, LocalAuth } = require('whatsapp-web.js');
const clients = {};

// Opciones de configuración de puppeteer para ejecutar sin entorno gráfico
const chromiumArgs = [
  '--disable-extensions',
  '--disable-gpu',
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-dev-shm-usage',
  '--disable-accelerated-2d-canvas',
  '--no-first-run',
  '--no-zygote',
  '--single-process',
  '--disable-features=site-per-process',
];

for (let i = 1; i <= 50; i++) {
  const clientId = `client${i}`;
  clients[clientId] = new Client({
    // Configuración de autenticación local
    authStrategy: new LocalAuth({ clientId }),

    // Configuración de puppeteer
    puppeteer: {
      headless: true,
      executablePath: '/usr/bin/chromium-browser',
      args: chromiumArgs,
    },

    // Opciones adicionales del cliente
    takeoverOnConflict: true,
    useChrome: true,
  });
}

module.exports = clients; */

