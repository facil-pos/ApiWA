const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.query(`
  CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    client TEXT NOT NULL,
    number TEXT NOT NULL,
    message TEXT NOT NULL,
    date TIMESTAMP NOT NULL
  );
`).then(() => {
  console.log('La tabla messages ha sido creada con éxito.');
  pool.end(); // Cierra la conexión con la base de datos
}).catch((err) => {
  console.error('Error al crear la tabla messages:', err);
  pool.end(); // Cierra la conexión con la base de datos
});
