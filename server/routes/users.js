const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const jwtMiddlewares = require('../middlewares/middlewares');

router.post('/signup', userController.signup);
router.post('/signin', userController.signin);
router.get('/home', jwtMiddlewares.userJwt, userController.userPersonalHome);
router.put('/alarm', jwtMiddlewares.userJwt, userController.alaramCheck);
router.get('/check/:nickName', userController.nickNameCheck);
router.put('/nickname', jwtMiddlewares.userJwt, userController.nickNameChange);
router.put('/refreshtoken', jwtMiddlewares.refreshToken);

module.exports = router;