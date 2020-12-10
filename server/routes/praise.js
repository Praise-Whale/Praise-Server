const express = require('express');
const router = express.Router();
const praiseController = require('../controller/praiseController');
const jwtMiddlewares = require('../middlewares/middlewares');

router.get('/target', jwtMiddlewares.userJwt, praiseController.praiseTarget);

module.exports = router;