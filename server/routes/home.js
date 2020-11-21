const { Router } = require('express');
const express = require('express');
const router = express.Router();
const homeController = require('../controller/homeController');
router.get('/', homeController.home);

module.exports = router;