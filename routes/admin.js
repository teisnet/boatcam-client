var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
	res.render('admin/index' /*, { user: req.user }*/);
});

router.get('/cameras', function(req, res) {
	res.render('admin/cameras');
});

module.exports = router;
