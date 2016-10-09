"use strict";

var express = require('express');
var router = express.Router();


router.get('/login', function(req, res) {
	res.render('login');
});

router.get('/', function(req, res) {
	res.render('index');
});


router.get('/profile', function(req, res) {
	res.render('profile');
});


// CAMERAS
router.get('/cameras', function(req, res) {
	res.render('cameras');
});


router.get('/cameras/:cameraSlug', function(req, res) {
	res.render('camera');
});


// EXAMPLES
router.get('/examples', function(req, res) {
	res.render('examples/index');
});

router.get('/examples/:exampleName/:camera?', function(req, res) {
	let exampleName = req.params.exampleName;
	res.render('examples/' + exampleName);
});


module.exports = router;
