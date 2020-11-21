const express = require('express');
const router = express.Router();
const levelController = require('../controller/levelController');

router.get('/praise/:userIdx', levelController.userLevel);


module.exports = router;