const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const jwtMiddlewares = require('../middlewares/middlewares');

router.post('/signup', userController.signup);
router.post('/signin', userController.signin);
router.get('/home', jwtMiddlewares.userJwt, userController.userHome);

module.exports = router;