var express = require('express');
var router = express.Router();

// ====================
// profile (GET)
// ====================
router.get('/', function(req, res, next){
  	res.locals.title = 'Profile';
	res.render('profile');
});

module.exports = router;