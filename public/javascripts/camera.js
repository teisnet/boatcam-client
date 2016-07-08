"use strict";

var socketUrl = config.socketUrl;

var Camera = function(config){
	var self = this;

	self.position = {x: 0, y: 0, zoom: 0};
	self.online = false;
	self.id = config.id;
	self.socket = io(socketUrl + "/cameras/" + config.slug);

	nextTick(function(){
		self.socket.on("move", function(pos){
			self.position = pos;
			$(self).triggerHandler("move", pos);
		});

		self.socket.on("status", function(value){
			self.online = value.online;
			self.enabled = value.enabled;
			self.status = value.status;
			$(self).triggerHandler("status", value);
		});

	});
};


Camera.prototype.move = function(direction){
	console.log("Camera.move: " + direction);
	this.socket.emit('move', direction);
}

Camera.prototype.moveTo = function(pos) {
	console.log("Camera.moveTo: " + JSON.stringify(pos));
	this.socket.emit('moveto', pos);
}

Camera.prototype.stop = function() {
	this.socket.emit('move', "stop");
}

Camera.prototype.snapshot = function(cb) {
	this.socket.emit('snapshot', null, function(result) {
		cb(null, result);
	});
}
