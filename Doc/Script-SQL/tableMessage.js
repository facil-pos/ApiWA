const pool = require('.../db/db');

const createTableQuery = `
CREATE TABLE IF NOT EXISTS public.message (
  id serial4 NOT NULL,
  client varchar NOT NULL,
  numbers varchar NULL,
  message text NULL,
  created_at timestamptz NULL DEFAULT CURRENT_TIMESTAMP,
  usuario varchar NULL,
  CONSTRAINT message_pkey PRIMARY KEY (id)
);
`;

(async () => {
    const client = await pool.connect();
    try {
        await client.query(createTableQuery);
        console.log('La tabla "message" se ha creado correctamente.');
    } finally {
        client.release();
        pool.end();
    }
})().catch(err => console.error(err));