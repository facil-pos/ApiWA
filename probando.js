const clients = require('./controllers/clients');
const clientes = {};
// Genera los códigos QR para cada cliente
function generateQrCodes(clients) {
  for (const [clientId, client] of Object.entries(clients)) {
    client.on('qr', (qr) => {
      clientes[clientId] = qr; // Almacena el código QR en la variable qrCodes
      console.log(clientId); // Se ejecuta cuando se genera un código QR
      
    });
    client.initialize(); // Inicializa el cliente
  }
}
//ejecutar la funcion generateQrCodes
generateQrCodes(clients);
