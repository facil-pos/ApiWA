const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const users = req.session?.user?.username;
  if (users) {
    res.json({ On: users });
  } else {
    res.json({ Off: 'No hay usuarios conectados' });
  }
});

module.exports = router;
