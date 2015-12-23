var express = require('express');
var router = express.Router();
var https = require('https');
var moment = require('moment');

router.get('/', function(req, res) {
	var responseString = '';

	res.locals.title = 'Tasks'
	
	https.get('https://localhost/api/tasks', function(api_res) {
		api_res.setEncoding('utf-8');
		api_res.on('data', function(d) {
			responseString+=d;
		});
		api_res.on('end', function() {
			res.locals.tasks = JSON.parse(responseString);
			res.locals.moment = moment;
			res.render('tasks');
		});
	});
});

// ====================
// export
// ====================
module.exports = router;