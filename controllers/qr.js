const qrcode = require('qrcode');
const pool = require('../db/db');
const qrCodes = {};

let savedClientId;

async function generateQrCodes(clients) {
  for (const [clientId, client] of Object.entries(clients)) {
    const generateQrCode = new Promise((resolve) => {
      client.on('qr', (qr) => {
        qrCodes[clientId] = qr;
        console.log(`QR ${clientId}`); 
        return res(`QR ${clientId}`);
      });

      client.on('ready', () => {
        console.log(`${clientId} Conectado con Exito!`);
        resolve();
      });

      client.initialize();
    });

    // Espera a que la promesa se resuelva antes de continuar
    await generateQrCode;
  }
}

async function getQrImage(clientId) {
  if (!qrCodes[clientId]) {
    throw new Error('QR code not found');
  }

  const qrImage = await qrcode.toBuffer(qrCodes[clientId], { scale: 4 });
  return qrImage;
}

module.exports = { generateQrCodes, getQrImage, savedClientId };





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
