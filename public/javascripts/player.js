'use strict';

function Player(url, elementName) {
	var self = this;
	elementName = elementName || '#player';
	var slash = url.lastIndexOf('/');
	var playUrl = url.substr(0, slash);
	var playStream = url.substr(slash + 1);
	this.status = 'pending';
	// http://flash.flowplayer.org/documentation/configuration/clips.html
	this.player = flowplayer($(elementName).get(0),
		{
			src: 'http://releases.flowplayer.org/swf/flowplayer-3.2.18.swf',
			wmode: 'direct'  // Needed for 'accellerated' to take effect
		},
		{
			clip: {
				url: playStream,
				scaling: 'fit',
				live: true,
				bufferLength: 2.0, //0, 0.1, 0.3 or 2 sec,
				provider:'rtmp',
				accelerated: true, // Hardware accelleration,
				autoplay: true // No effect
				// Autobuffering?
			},
			play: null,
			plugins:{
				controls: null, // 'controls: null' will not download controlbar at all
				/* controls: {
					// display: 'none',
					all: false,
					fullscreen: true,
					backgroundColor: 'transparent',
					backgroundGradient: 'none',
				}, */
				rtmp:{
					url: 'http://releases.flowplayer.org/flowplayer.rtmp/flowplayer.rtmp-3.2.13.swf',
					netConnectionUrl: playUrl
				}
			},
			canvas: {'backgroundColor': '#000000','backgroundGradient':'none'}
		}
	);

	self.attachEventHandlers(self.player);

	nextTick(function(){
		$(self).triggerHandler('status', self.status);
	});
};


Player.prototype.attachEventHandlers = function(player){
	var self = this;
	player.onLoad(function(clip){   self.setPlayerStatus(clip, 'pending', 'onLoad'); });  // Called on startup # 1
	player.onBegin(function(clip){  self.setPlayerStatus(clip, 'pending', 'onBegin'); }); // Called on startup # 2
	player.onStart(function(clip){  self.setPlayerStatus(clip, 'playing', 'onStart'); }); // Called on startup # 3
	player.onResume(function(clip){ self.setPlayerStatus(clip, 'playing', 'onResume'); });

	player.onBufferEmpty(function(clip){ self.setPlayerStatus(clip, null, 'onBufferEmpty'); }); // Called regularily
	player.onBufferFull(function(clip){  self.setPlayerStatus(clip, null, 'onBufferFull'); });  // Called regularily
	player.onBufferStop(function(clip){  self.setPlayerStatus(clip, null, 'onBufferStop'); });  // onStop is also called
	player.onLastSecond(function(clip){  self.setPlayerStatus(clip, null, 'onLastSecond'); });
	player.onSeek(function(clip){        self.setPlayerStatus(clip, null, 'onSeek'); });

	player.onClipAdd(function(clip){  self.setPlayerStatus(clip, null, 'onClipAdd'); });
	player.onCuepoint(function(clip){ self.setPlayerStatus(clip, null, 'onCuepoint'); });

	player.onError(function(clip){  self.setPlayerStatus(clip, 'stopped', 'onError'); });
	player.onFinish(function(clip){ self.setPlayerStatus(clip, 'stopped', 'onFinish'); });
	player.onStop(function(clip){   self.setPlayerStatus(clip, 'stopped', 'onStop'); }); // Called
	player.onPause(function(clip){  self.setPlayerStatus(clip, 'paused', 'onPause'); });
	player.onUnload(function(clip){ self.setPlayerStatus(clip, null, 'onUnload'); });
	player.onUpdate(function(clip){ self.setPlayerStatus(clip, null, 'onUpdate'); });
}


Player.prototype.setPlayerStatus = function(clip, status, eventName) {
	// Status: pending, playing, paused, stopped
	var self = this;
	if (status) {
		console.log('%cPlayer.' + eventName + ': ' + status,  'color: blue');
		if (status === self.status) return;
		self.status = status;

		/* if (eventName === 'onBegin') {
			var currentClip = player.getClip();

			currentClip.onNetStreamEvent(function(clip, netStreamEvent){
				console.log('NetStreamEvent: ' + JSON.stringify(netStreamEvent));
			});

		}*/

		$(self).triggerHandler('status', self.status);
	}
	else {
		console.log('Player.' + eventName);
	}
}

Player.prototype.setUrl = function(url) {
	var slash = url.lastIndexOf('/');
	var playUrl = url.substr(0, slash);
	var playStream = url.substr(slash + 1);
	this.player.unload();
	// this.player.play({netConnectionUrl: playUrl, url: playStream});
}

Player.prototype.get = function() {
	return this.player;
}

Player.prototype.stop = function() {
	return this.player.stop();
}

Player.prototype.play = function() {
	return this.player.play();
}
