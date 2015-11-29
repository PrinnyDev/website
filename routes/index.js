var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{ title: 'Index', globalErrorMessage: req.flash('globalErrorMessage') });
});

/* POST Login page */
router.post('/login', passport.authenticate('local-login', {
	successRedirect: '/profile',
	failureRedirect: '/',
	failureFlash: true
}));

/* POST Register page */
router.post('/register', passport.authenticate('local-signup', {
	successRedirect: '/',
	failureRedirect: '/',
	failureFlash: true
}));

/* GET profile page */
router.get('/profile', isLoggedIn, function(req, res, next){
	res.render('profile', {title: 'Profile', user: req.user});
});

/* GET logout page */
router.get('/logout', function(req, res, next){
	req.logout();
	res.redirect('/');
});

function isLoggedIn(req, res, next){
	if (req.isAuthenticated()) {
		return next();
	}
	else {
		res.redirect('/');
	}
}


module.exports = router;
