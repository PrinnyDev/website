var express = require('express');
var router = express.Router();


// ====================
// Middleware
// ====================
router.use(function(req, res, next) {
	if (!isAdmin(req.user)) {
		res.redirect('/');
	}
	else {
		res.locals.user = req.user;
		next();
	}
});

router.use('/tasks', require('./tasks'));

// ====================
// methods
// ====================
function isAdmin(user) {
	return user.admin;
}

// ====================
// export
// ====================
module.exports = router;