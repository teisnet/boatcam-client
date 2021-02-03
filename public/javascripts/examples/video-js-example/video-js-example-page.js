'use strict';

var apiUrl = config.apiUrl;
var snapshotsUrl = config.snapshotsUrl;

var player = null;
var camera = null;
var cameraId = null;
var down = {};
var berths = [];

var api = null;

var path = window.location.pathname;
path = path.match(/^\/examples\/video-js-example(\/(.+))?$/);
path = path[2];
if (path) {
	BoatCamApi.cameras.get(path)
	.done(function(cameraData){
		cameraId = cameraData.id;
		camera = cameraData;
		var cameraUri = cameraData.uri;
		var slash = cameraUri.lastIndexOf('/');

		document.title = document.title + ' | ' + cameraData.title;
		$('.camera-title').text(cameraData.title);

		initPlayer(cameraData.uri);

	})
	.fail();
}

function initPlayer(url) {
	var slash = url.lastIndexOf('/');
	var playUrl = url.substr(0, slash);
	var playStream = url.substr(slash + 1);

	var player = videojs('player', {
		autoplay: true,
		width: 640,
		height: 480
	}, function() {
		console.log('Good to go!');
		this.play(); // if you don't trust autoplay for some reason

		this.on('ended', function() {
			console.log('awww...over so soon?');
		});
});

};
