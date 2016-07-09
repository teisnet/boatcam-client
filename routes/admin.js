var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
	res.render('admin/index' /*, { user: req.user }*/);
});


// CAMERAS
router.get('/cameras', function(req, res) {
	res.render('admin/cameras');
});

router.get('/cameras/new', function(req, res) {
	res.render('admin/camera', { newCameraPage: true });
});

router.get('/cameras/:cameraSlug', function(req, res) {
	res.render('admin/camera', { newCameraPage: false });
});

// BERTHS
router.get('/berths', function(req, res) {
	res.render('admin/berths');
});

router.get('/berths/new', function(req, res) {
	res.render('admin/berth', { newBerthPage: true });
});

router.get('/berths/:berthNumber', function(req, res) {
	res.render('admin/berth', { newBerthPage: false });
});

module.exports = router;
