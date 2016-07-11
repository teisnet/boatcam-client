"use strict";

var CameraApi = new Api("cameras");

CameraApi.get("fjellebroen-ost")
.done(function(cameraData){
	setup(cameraData);
});

function setup(cameraData) {
	var player = new Player(cameraData.uri);
	var camera = new Camera(cameraData);

	// BUTTON HANDLERS

	$(".snapshot-btn").click(function() {
		var snapshotWindow = window.open("","Snapshot","");
		camera.snapshot(function(err, result) {
			snapshotWindow.location = config.snapshotsUrl + "/" + result;
		});
	});

	$(".pos1-btn").click(function() {
		camera.moveTo({ x: 0, y: 0, zoom: 1.0 });
	});

	$(".pos2-btn").click(function() {
		camera.moveTo({ x: 180, y: 45, zoom: 5.0 });
	});

	// CAMERA SOCKET EVENT HANDLERS

	$(camera).on('move', function (event, pos) {
		// pos = { x, y, zoom }
		$('.camera-position').text("x: " + pos.x.toFixed(1) + "\xB0 y: " + pos.y.toFixed(1) + "\xB0 zoom: " + pos.zoom.toFixed(1) + "x");
	});

	$(camera).on('status', function (event, value) {
		var element = $(".camera-status-indicator");
		element.removeClass("online offline disabled");
		element.addClass(value.status);
	});
}
