var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

module.exports = function(passport){
	passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user);
		});
	});

	passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true	
	},
	function(req, email, password, done){
		process.nextTick(function(){
			User.findOne({'email': email}, function(err, user){
				if (err) {
					return done(err);
				}
				else {
					// if user with that email already exists
					if (user) {
						return done(null, false, req.flash('globalErrorMessage', 'Account already exists with that email.'));
					}
					// if passwords do not match
					if (password != req.body.passwordConfirm) {
						return done(null, false, req.flash('globalErrorMessage', 'Your passwords do not match.'));
					}
					// if email is invalid (must be: somename@somedomain.com/net/org/etc...)
					var validEmail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
					if (!validEmail.test(email)) {
						return done(null, false, req.flash('globalErrorMessage', 'Invalid email.'));
					}
					// add user to database
					var newUser = new User();

					newUser.email = email;
					newUser.password = newUser.generateHash(password);
					newUser.active = false;
					newUser.admin = false;

					newUser.save(function(err){
						if (err) {
							throw err;
						}
						else {
							return done(null, newUser);
						}
					});
				}
			})
		})
	}));

	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	}
	,function(req, email, password, done){
		User.findOne({'email': email}, function(err, user){
			if (err) {
				return done(err);
			}

			if (!user) {
				return done(null, false, req.flash('globalErrorMessage', 'User not found.'));
			}

			if (!user.validPassword(password)) {
				return done(null, false, req.flash('globalErrorMessage', 'Password incorrect.'));
			}

			if (!user.active) {
				return done(null, false, req.flash('globalErrorMessage', 'User inactive.'));
			}

			return done(null, user);
		});
	}));
}