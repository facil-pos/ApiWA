const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');

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

  /* //Imagenes
  const fs = require('fs');
  const base64Img = require('base64-img');
  clients[clientId].sendMessageWithMedia = async (phoneNumber, message, imageNames) => {
    const client = clients[clientId];
    const chat = await client.getChatById(phoneNumber);

    for (const imageName of imageNames) {
      const imagePath = `public/images/${imageName}`;
      const base64Image = base64Img.base64Sync(imagePath);
      const dataUri = `data:image/jpeg;base64,${base64Image}`;

      try {
        await chat.sendMessage(dataUri, { caption: message });
        console.log(`Imagen ${imageName} enviada con éxito`);
      } catch (error) {
        console.error(`Error al enviar la imagen ${imageName}:`, error);
      }
    }
  }; */
}

module.exports = clients;