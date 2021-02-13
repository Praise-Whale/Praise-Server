const express = require('express');
const router = express.Router();
const homeController = require('../controller/homeController');
const jwtMiddlewares = require('../middlewares/middlewares');

router.get('/home', jwtMiddlewares.userJwt, homeController.praiseHome);

module.exports = router;