const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const alarmController = require('../controller/alarmController');
const jwtMiddlewares = require('../middlewares/middlewares');

router.post('/signup', userController.signup);
router.post('/signin', userController.signin);
router.get('/home', jwtMiddlewares.userJwt, userController.userPersonalHome);
router.post('/alarm', jwtMiddlewares.userJwt, userController.alaramCheck);
router.get('/check/:nickName', userController.nickNameCheck);
router.put('/nickname', jwtMiddlewares.userJwt, userController.nickNameChange);
router.put('/refreshtoken', jwtMiddlewares.refreshToken);
router.get('/alarm', alarmController.alarm);

module.exports = router;