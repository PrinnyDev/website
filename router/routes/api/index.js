var express = require('express');
var router = express.Router();


// ====================
// Middleware
// ====================
router.use('/tasks', require('./tasks'));

// ====================
// export
// ====================
module.exports = router;