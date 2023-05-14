const qrcode = require('qrcode');
const qrCodes = {};

async function generateQrCodes(clients) {
  for (const [clientId, client] of Object.entries(clients)) {
    const generateQrCode = new Promise((resolve) => {
      client.on('qr', (qr) => {
        qrCodes[clientId] = qr;
        console.log(`QR ${clientId}`);
        /* res.json({ message: `QR ${clientId}` }); */
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
module.exports = { generateQrCodes, getQrImage };


