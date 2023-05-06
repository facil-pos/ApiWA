const express = require('express');
const router = express.Router();

const requireLogin = (req, res, next) => {
  if (req.session && req.session.user) {
      next();
  } else {
      //el user no esta conectado
      res.redirect('/login');
  }
};

router.get('/',  async (req, res) => {
  const users = req.session?.user?.username;
  if (users) {
    requireLogin, res.json({ On: users });
  } else {
    res.json({ Off: 'No hay usuarios conectados' });
  }
});

module.exports = router;
