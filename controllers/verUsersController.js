const express = require('express');
const router = express.Router();
const requireLoginAdmin = require('../middleware/requireLoginAdmin');

router.get('/', requireLoginAdmin, async (req, res) => {
  const users = []; // Array para almacenar los usuarios conectados
  const sessions = req.sessionStore.sessions;

  for (let sessionKey in sessions) {
    const session = JSON.parse(sessions[sessionKey]);

    if (session.user) {
      users.push(session.user.username);
    }
  }

  if (users.length > 0) {
    res.json({ users });
  } else {
    res.json({ Off: 'Sin usuarios conectados' });
  }
});

module.exports = router;
