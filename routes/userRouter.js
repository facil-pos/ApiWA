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
  const user = req.session?.user?.username;
  if (user) {
    requireLogin, res.json({ On: user });
  } else {
    res.json({ Off: 'Sin usuario conectado' });
  }
});

module.exports = router;
