const express = require('express');
const router = express.Router();

const requireLoginAdmin = require('../middleware/requireLoginAdmin');
const requireLogin = require('../middleware/requireLogin');

const loginController = require('../controllers/userController');
const messagesRouter = require('../controllers/messagesController');
/* const imagesRouter = require('../controllers/imagesController'); */
const registerRouter = require('../controllers/registerController');
const userRouter = require('./userRouter');
const usersRouter = require('./usersRouter');
/* const auth = require('../controllers/auth'); */

router.use('/register', registerRouter);
router.post('/login', loginController.login);
router.post('/logout', requireLogin, loginController.logout);
router.post('/disableUser', requireLoginAdmin, loginController.disableUser);
router.post('/enableUser', requireLoginAdmin, loginController.enableUser);
router.use('/user', userRouter);
router.use('/users', usersRouter);
router.use('/sendMessage', messagesRouter, requireLogin);
/* app.use(imagesRouter); */

module.exports = router;