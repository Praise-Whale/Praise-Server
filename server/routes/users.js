var express = require('express');
var router = express.Router();
const userController = require('../controller/userController');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/praise', userController.praiseUsers);
router.post('/target', userController.userTarget);
router.post('/signin', userController.signin);
router.post('/signup', userController.signup);


module.exports = router;
