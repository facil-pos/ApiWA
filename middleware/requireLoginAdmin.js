const pool = require('../db/db');

const requireLoginAdmin = (req, res, next) => {
  // Verificar si no hay ningún usuario conectado
  if (!req.session.user || !req.session.user.username) {
    res.redirect('/login'); // Redirigir a la ruta /login
    return;
  }

  const username = req.session.user.username;
  const query = {
    text: 'SELECT isadmin FROM users WHERE username = $1',
    values: [username],
  };
  pool.query(query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error de servidor');
      return;
    }
    const isadmin = result.rows[0].isadmin;
    if (isadmin) {
      next();
    } else {
      res.status(403).send('No tienes permisos para acceder a esta página');
    }
  });
};

module.exports = requireLoginAdmin;

