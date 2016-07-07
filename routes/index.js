var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
	res.render('index');
});


router.get('/cameras', function(req, res) {
	res.render('cameras');
});


router.get('/cameras/:cameraSlug', function(req, res) {
	res.render('camera');
});


module.exports = router;
