var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/users', require('./users'));
router.use('/home', require('./home'));
router.use('/level', require('./level'));
router.use('/praise', require('./collection'));

module.exports = router;
