var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
	res.render('index');
});


router.get('/cameras', function(req, res) {
	res.render('cameras');
});


module.exports = router;
