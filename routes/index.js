var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index');
});


router.get('/cameras', function(req, res, next) {
	res.render('cameras');
});


module.exports = router;
