const express = require('express');
const router = express.Router();
const requireLogin = require('../middleware/requireLogin');

router.get('/',  async (req, res) => {
  const user = req.session?.user?.username;
  if (user) {
    requireLogin, res.json({ On: user });
  } else {
    res.json({ Off: 'Sin usuario conectado' });
  }
});

module.exports = router;
