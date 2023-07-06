const { Pool } = require('pg');
require('dotenv').config();

// Configuración de la conexión a la base de datos
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

process.on('SIGINT', () => {
  console.log('PostgreSQL pool desconectado');
  pool.end()
    .then(() => {
      console.log('PostgreSQL pool cerrado');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Error al cerrar PostgreSQL pool', err);
      process.exit(1);
    });
});

module.exports = pool;
