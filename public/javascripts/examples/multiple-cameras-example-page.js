"use strict";

var Cameras = {};

BoatCamApi.cameras.getAll()
.done(function(camerasData){
	var camerasSelect = $(".cameras-select");
	$.each(camerasData, function(index, cameraData) {
		camerasSelect.append($("<option />").val(cameraData.id).text(cameraData.title));
		Cameras[cameraData.id] = cameraData;
	});

	var camera = setupCamera(camerasData[0]);
	var player = setupPlayer(camerasData[0]);

	$(".cameras-select").change(function(){
		camera.set(Cameras[this.value]);
		player.setUrl(Cameras[this.value].uri);
	});

});


function setupCamera(cameraData) {
	document.title = document.title + " | " + cameraData.title;
	var camera = new Camera(cameraData);

	$(".snapshot-btn").click(function() {
		var snapshotWindow = window.open("","Snapshot","");
		camera.snapshot(function(err, result) {
			snapshotWindow.location = config.snapshotsUrl + "/" + result;
		});
	});

	$(".fullscreen-btn").click(function(){ toggleFullScreen($(".fullscreen-window").get(0)); });

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

	return camera;
}

function setupPlayer(cameraData) {
	var player = new Player(cameraData.uri);

	$(player).on('status', function(event, status) {
		var playerElement = $(".video-window");
		playerElement.removeClass("pending playing paused stopped");
		playerElement.addClass(status);
	});

	return player;
}
