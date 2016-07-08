var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
	res.render('admin/index' /*, { user: req.user }*/);
});

router.get('/cameras', function(req, res) {
	res.render('admin/cameras');
});

router.get('/cameras/new', function(req, res) {
	res.render('admin/camera', { newCameraPage: true });
});

router.get('/cameras/:cameraSlug', function(req, res) {
	res.render('admin/camera', { newCameraPage: false });
});

module.exports = router;
