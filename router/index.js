var express = require('express');
var router = express.Router();
var passport = require('passport');
var publicPages = ['/', '/login', '/logout', '/register'/*, '/api/tasks'*/];

// ====================
// External routes (not login protected)
// ====================
router.use('/api', require('./routes/api/index'));

// ====================
// Middleware
// ====================
router.use(function(req, res, next){
	if (!isLoggedIn(req) && (publicPages.indexOf(req.url) == -1)) {
		res.redirect('/');
	}
	else {
		res.locals.user = req.user;
		next();
	}
});

// ====================
// External routes (login protected)
// ====================
router.use('/profile', require('./routes/profile'));
router.use('/admin', require('./routes/admin/index'));

// ====================
// index (GET)
// ====================
router.get('/', function(req, res, next) {
	res.locals.title = 'Index';
	res.locals.globalErrorMessage = req.flash('globalErrorMessage');
	res.render('index');
});

// ====================
// login (POST)
// ====================
router.post('/login', passport.authenticate('local-login', {
	successRedirect: '/profile',
	failureRedirect: '/',
	failureFlash: true
}));

// ====================
// logout (GET)
// ====================
router.get('/logout', function(req, res, next){
	req.logout();
	res.redirect('/');
});

// ====================
// register (post)
// ====================
router.post('/register', passport.authenticate('local-signup', {
	successRedirect: '/',
	failureRedirect: '/',
	failureFlash: true
}));

// ====================
// methods
// ====================
function isLoggedIn(req){
	return req.isAuthenticated();
}

// ====================
// export
// ====================
module.exports = router;