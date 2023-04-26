const qrcode = require('qrcode');
const qrCodes = {};
// Genera los códigos QR para cada cliente
function generateQrCodes(clients) {
  for (const [clientId, client] of Object.entries(clients)) {
    client.on('qr', (qr) => {
      qrCodes[clientId] = qr; // Almacena el código QR en la variable qrCodes
      console.log(`QR ${clientId}`); // Se ejecuta cuando se genera un código QR
    });
    client.on('ready', () => {
      console.log(`${clientId} Conectado con Exito!`); // Se ejecuta cuando el cliente se conecta con éxito
    });

    client.initialize(); // Inicializa el cliente
  }
}
// Obtiene la imagen del código QR correspondiente al ID del cliente
async function getQrImage(clientId) {
  if (!qrCodes[clientId]) {
    throw new Error('QR code not found'); 
  }

  const qrImage = await qrcode.toBuffer(qrCodes[clientId], { scale: 4 }); // Escala la imagen 4 veces
  return qrImage;
}
module.exports = { generateQrCodes, getQrImage };