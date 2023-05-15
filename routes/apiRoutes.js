// Dependencias de la API
const express = require('express');
const router = express.Router();

//Middlewares
const requireLoginAdmin = require('../middleware/requireLoginAdmin');
const requireLogin = require('../middleware/requireLogin');

//Controladores
const loginController = require('../controllers/userController');
const messagesRouter = require('../controllers/messagesController');
/* const imagesRouter = require('../controllers/imagesController'); */
const registerRouter = require('../controllers/registerController');
const userRouter = require('../controllers/verUserController');
const usersRouter = require('../controllers/verUsersController');
/* const auth = require('../controllers/auth'); */

//Rutas de la API
router.use('/register', registerRouter);
router.post('/login', loginController.login);
router.post('/logout', requireLogin, loginController.logout);
router.post('/disableUser', requireLoginAdmin, loginController.disableUser);
router.post('/enableUser', requireLoginAdmin, loginController.enableUser);
router.use('/user', userRouter);
router.use('/users', usersRouter);
router.use('/sendMessage', messagesRouter, requireLogin);
/* app.use(imagesRouter); */

//Exportar el módulo de rutas
module.exports = router;