const express = require('express');
const router = express.Router();
const praiseController = require('../controller/praiseController');

router.get('/target', praiseController.praiseTarget);

module.exports = router;