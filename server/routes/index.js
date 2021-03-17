var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/praise', require('./praise'));
router.use('/users', require('./users'));
router.use('/', require('./home'));

module.exports = router;