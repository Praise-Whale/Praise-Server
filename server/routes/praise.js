const express = require('express');
const router = express.Router();
const praiseController = require('../controller/praiseController');
const jwtMiddlewares = require('../middlewares/middlewares');

router.get('/target', jwtMiddlewares.userJwt, praiseController.latelyParaiseUsers);
router.get('/:year/:month', jwtMiddlewares.userJwt, praiseController.praiseCollection);
router.get('/ranking', jwtMiddlewares.userJwt, praiseController.praiseRanking);
router.post('/:praiseId', jwtMiddlewares.userJwt, praiseController.praiserUp);
router.get('/', jwtMiddlewares.userJwt, praiseController.eachTargetPraise);

module.exports = router;