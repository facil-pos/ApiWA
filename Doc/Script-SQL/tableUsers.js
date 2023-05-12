const pool = require('.../db/db');

const createTableQuery = `
CREATE TABLE IF NOT EXISTS public.users (
  id serial4 NOT NULL,
  username varchar(255) NOT NULL,
  "password" varchar(255) NOT NULL,
  client varchar NULL,
  num_msgs int4 NULL,
  created_at timestamptz NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NULL DEFAULT CURRENT_TIMESTAMP,
  disabled bool NULL,
  isadmin bool NULL,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_username_key UNIQUE (username)
);
`;

(async () => {
    const client = await pool.connect();
    try {
        await client.query(createTableQuery);
        console.log('La tabla "users" se ha creado correctamente.');
    } finally {
        client.release();
        pool.end();
    }
})().catch(err => console.error(err));
