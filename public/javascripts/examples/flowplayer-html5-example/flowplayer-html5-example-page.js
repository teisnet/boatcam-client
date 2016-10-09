'use strict';

var apiUrl = config.apiUrl;
var snapshotsUrl = config.snapshotsUrl;

var player = null;
var camera = null;
var cameraId = null;
var down = {};
var berths = [];
var flowplayerPath = '/javascripts/examples/flowplayer-html5-example/flowplayer-6.0.5/';

var api = null;

var path = window.location.pathname;
path = path.match(/^\/examples\/flowplayer-html5-example(\/(.+))?$/);
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

		initFlowplayer(cameraData.uri);

	})
	.fail();
}

function initFlowplayer(url) {
	var slash = url.lastIndexOf('/');
	var playUrl = url.substr(0, slash);
	var playStream = url.substr(slash + 1);

	var player = flowplayer('.video-window', {
		//playlist: [],
		clip: {
			sources: [
				{ type: 'video/flash', src: playStream } // RTMP via flowplayer.swf
				// { type: 'application/x-mpegurl', src: url.replace('rtmp://', 'http://') + '/playlist.m3u8' } // HLS via flowplayerhls.swf
				// { type: 'application/dash+xml', src: url.replace('rtmp://', 'http://') + '/manifest.mpd' } // DASH in browser
			],
			flashls: {
				// debug: true,
				// debug2: true,
				// fragmentloadmaxretry: 10,
				// minbufferlength: 2
			}
		},
		embed: false,
		ratio: 9/16,
		//splash: true
		rtmp: {
			bufferTime: 3,
			url: playUrl
		},
		live: true,
		swf: flowplayerPath + 'flowplayer.swf',
		swfHls: flowplayerPath + 'flowplayerhls.swf',
		autoplay: true,
		// debug: true,
		tooltip: false,
		keyboard: false
	});

	var events = 'beforeseek disable error finish flashdisabled fullscreen fullscreen-exit fullscreen-exit mute pause progress ready resume seek shutdown speed stop unload volume';

	player.on(events, function (e, api, video) {
		if (e.type === 'progress') { return; } // Fires frequently
		console.log('Player event "' + e.type + '"');
	})
	.on('ready', function (e, api, video) {
		$('.message').text(player.engine.engineName + ' engine playing ' + video.type);
	})
	.on('error', function (err) {
		$('.message').text('Error: ' + err.message);
	});

};
