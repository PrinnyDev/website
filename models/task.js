var mongoose = require('mongoose');

// ====================
// Schema 
// ====================
var taskSchema = new mongoose.Schema({
	title: String,
	description: String,
	tags: [String],
	submitted: { type: Date, default: Date.now },
	completed: Date,
	in_progress: { type: Boolean, default: false },
	priority: { type: Boolean, default: false } // true = high priority, false = low priority
});

// ====================
// Methods 
// ====================


// ====================
// Export 
// ====================
module.exports = mongoose.model('Task', taskSchema);