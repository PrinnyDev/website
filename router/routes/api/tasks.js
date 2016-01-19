var express = require('express');
var router = express.Router();
var Task = require('../../../models/task');

// ====================
// tasks (GET/POST)
// ====================
router.route('/')
	.post(function(req, res) {
		var task = new Task();
		
		task.title = req.body.title;
		task.description = req.body.description;
		task.tags = req.body.tags;
		task.priority = req.body.priority;

		task.save(function(err) {
			if (err) {
				res.send(err);
			}
			else {
				res.json({ message: 'Task created!' });
			}
		});
	})
	.get(function(req, res) {
		Task.find(function(err, tasks) {
			if (err) {
				res.send(err);
			}
			else {
				res.json(tasks);
			}
		});
	});


// ====================
// tasks/:id (GET/PUT)
// ====================
router.route('/:id')
	.get(function(req, res) {
		Task.findById(req.params.id, function(err, task) {
			if (err) {
				res.send(error);
			}
			else {
				res.json(task);
			}
		});
	})
	.put(function(req, res) {
		Task.findById(req.params.id, function(err, task) {
			if (err) {
				res.send(error);
			}

			task.title = req.body.title;
			task.description = req.body.description;
			task.tags = req.body.tags;
			task.completed = req.body.completed;
			task.in_progress = req.body.in_progress;
			task.priority = req.body.priority;

			task.save(function(err) {
				if (err) {
					res.send(err);
				}
				else {
					res.json({ message: 'Task updated!' });
				}
			});
		});
	})
	.delete(function(req, res) {
		Task.remove({
			_id: req.params.id
		}, function(err, task) {
			if (err) {
				res.send(err);
			}
			else {
				res.json({ message: 'Task deleted!' });
			}
		})
	});

// ====================
// export
// ====================
module.exports = router;