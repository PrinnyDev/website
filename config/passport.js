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
					if (user) {
						return done(null, false, req.flash('globalErrorMessage', 'That email is already taken.'));
					}
					else if (password != req.body.passwordConfirm) {
						return done(null, false, req.flash('globalErrorMessage', 'Your passwords do not match.'));
					}
					else {
						var newUser = new User();

						newUser.username = email.split('@')[0];
						newUser.password = newUser.generateHash(password);
						newUser.email = email;
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
				}
			})
		})
	}));

	passport.use('local-login', new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password',
		passReqToCallback: true
	}
	,function(req, username, password, done){
		User.findOne({'username': username}, function(err, user){
			if (err) {
				return done(err);
			}

			if (!user) {
				return done(null, false, req.flash('globalErrorMessage', 'User not found.'));
			}

			if (!user.validPassword(password)) {
				return done(null, false, req.flash('globalErrorMessage', 'Password incorrect.'));
			}

			return done(null, user);
		});
	}));
}