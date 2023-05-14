const { Pool } = require('pg');
require('dotenv').config();

// Configuración de la conexión a la base de datos
const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT,
});

process.on('SIGINT', () => {
  console.log('PostgreSQL pool cerrado');
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
