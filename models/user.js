var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// Schema ====================
var userSchema = mongoose.Schema({
	username: String,
	password: String,
	email: String,
	admin: Boolean,
	active: Boolean
});

// Methods ====================
// generate hash
userSchema.methods.generateHash = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

// check if password is valid
userSchema.methods.validPassword = function(password){
	return bcrypt.compareSync(password, this.password);
}

// Export ====================
module.exports = mongoose.model('User', userSchema);