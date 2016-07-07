
"use strict";

function initPlayer(config) {
	// http://flash.flowplayer.org/documentation/configuration/clips.html
	player = flowplayer("player",
		{
			src: "http://releases.flowplayer.org/swf/flowplayer-3.2.18.swf",
			wmode: "direct"  // Needed for 'accellerated' to take effect
		},
		{
		'clip': {
			'url': config.stream,
			'scaling':'fit',
			'live': true,
			'bufferLength': 2.0, //0, 0.1, 0.3 or 2 sec,
			'provider':'rtmp',
			'accelerated': true, // Hardware accelleration,
			'autoplay': true // No effect
			// Autobuffering?
		},
		play: null,
		'plugins':{
			'controls': null, // 'controls: null' will not download controlbar at all
			/* 'controls': {
				// display: 'none',
				all: false,
				fullscreen: true,
				backgroundColor: "transparent",
				backgroundGradient: "none",
			}, */
			'rtmp':{
				'url':'http://releases.flowplayer.org/flowplayer.rtmp/flowplayer.rtmp-3.2.13.swf',
				'netConnectionUrl': config.url
				}
			},
		'canvas':{"backgroundColor": "#000000",'backgroundGradient':'none'}
	});

	attachEventHandlers(player);
};


function attachEventHandlers(player){
	player.onLoad(function(clip){   setPlayerStatus(clip, "pending", "onLoad"); });	  // Called on startup # 1
	player.onBegin(function(clip){  setPlayerStatus(clip, "pending", "onBegin"); });  // Called on startup # 2
	player.onStart(function(clip){  setPlayerStatus(clip, "playing", "onStart"); }); // Called on startup # 3
	player.onResume(function(clip){ setPlayerStatus(clip, "playing", "onResume"); });

	player.onBufferEmpty(function(clip){ setPlayerStatus(clip, null, "onBufferEmpty"); }); // Called regularily
	player.onBufferFull(function(clip){  setPlayerStatus(clip, null, "onBufferFull"); });   // Called regularily
	player.onBufferStop(function(clip){  setPlayerStatus(clip, null, "onBufferStop"); });   // onStop is also called
	player.onLastSecond(function(clip){  setPlayerStatus(clip, null, "onLastSecon"); });
	player.onSeek(function(clip){        setPlayerStatus(clip, null, "onSeek"); });

	player.onClipAdd(function(clip){  setPlayerStatus(clip, null, "onClipAdd"); });
	player.onCuepoint(function(clip){ setPlayerStatus(clip, null, "onCuepoint"); });

	player.onError(function(clip){  setPlayerStatus(clip, "stopped", "onError"); });
	player.onFinish(function(clip){ setPlayerStatus(clip, "stopped", "onFinish"); });
	player.onStop(function(clip){   setPlayerStatus(clip, "stopped", "onStop"); });     // Called
	player.onPause(function(clip){  setPlayerStatus(clip, "paused", "onPause"); });
	player.onUnload(function(clip){ setPlayerStatus(clip, null, "onUnload"); });
	player.onUpdate(function(clip){ setPlayerStatus(clip, null, "onUpdate"); });
}


var playerStatus = "pending";

function setPlayerStatus(clip, status, eventName) {
	// Status: pending, playing, paused, stopped
	if (status) {
		playerStatus = status;
		console.log("%cPlayer." + eventName + ": " + playerStatus,  "color: blue");

		/* if (eventName === "onBegin") {
			var currentClip = player.getClip();

			currentClip.onNetStreamEvent(function(clip, netStreamEvent){
				console.log("NetStreamEvent: " + JSON.stringify(netStreamEvent));
			});

		}*/

		var playerElement = $(".video-window");
		playerElement.removeClass("pending playing paused stopped");
		playerElement.addClass(status);
	}
	else {
		console.log("Player." + eventName);
	}
}
