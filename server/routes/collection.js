const express = require('express');
const router = express.Router();
const collectionController = require('../controller/collectionController');


router.get('/collection', collectionController.collection);


module.exports = router;