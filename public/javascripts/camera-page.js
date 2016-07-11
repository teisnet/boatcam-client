"use strict";

var apiUrl = config.apiUrl;
var snapshotsUrl = config.snapshotsUrl;

var CameraApi = new Api("cameras");
var player = null;
var camera = null;
var down = {};


// LOAD DATA
$.getJSON(apiUrl + '/berths', function(berthData) {
	$(berthData).each(function (index, berth) {
		var $option = $("<option/>").attr("value", berth._id).text(berth.number + " - " + berth.owner);
		$('#berths').append($option);
	});
});

// Client side redirect if sub-route points to a camera instance
var path = window.location.pathname;
path = path.match(/^\/cameras(\/(.*))?$/)[2];
if (path) {
	CameraApi.get(path)
	.done(function(cameraData){
		var cameraUri = cameraData.uri;
		var slash = cameraUri.lastIndexOf("/");

		document.title = document.title + " | " + cameraData.title;
		$(".camera-title").text(cameraData.title);

		player = new Player(cameraData.uri);
		camera = new Camera(cameraData);
		initPlayer(player);
		initCamera(camera);
	})
	.fail();
}


$(document).keydown(function(event){
	var key = event.which || event.keyCode || 0;

	if (!down[key]) { // first press
		down[key] = true; // record that the key's down

		switch(key) {
			case 38:
				onMoveCameraKey("up");
			break;
			case 40:
				onMoveCameraKey("down");
			break;
			case 37:
				onMoveCameraKey("left");
			break;
			case 39:
				onMoveCameraKey("right");
			break;
			case 187: // +
				onMoveCameraKey("zoomIn");
			break;
			case 189: // -
				onMoveCameraKey("zoomOut");
			break;
			case 70: // F
				toggleFullScreen($(".video-container").get(0));
			break;
		}

		// Ctrl key
		if (down[17]) {
			switch(key) {
				case 70: // F - clashes with 'find'
					// requestFullScreen($("#player").get(0));
				break;
			}

		}
	}
});

$(document).keyup(function(event){
	var key = event.which || event.keyCode || 0;
	down[key] = null;
	switch(key) {
		case 38:  // Up
		case 40:  // Down
		case 37:  // Left
		case 39:  // Right
		case 187: // +
		case 189: // -
			onMoveCameraKey("Stop");
		break;
	}
});


function initPlayer(player) {
	$(player).on('status', function(event, status) {
		var playerElement = $(".video-window");
		playerElement.removeClass("pending playing paused stopped");
		playerElement.addClass(status);
	});
}


function initCamera(camera) {
	$(".camera-play-button").mousedown(onPlayCamera);
	$(".video-overlay .up").mousedown("up",onMoveCamera);

	$(".video-overlay .left").mousedown("left",onMoveCamera);
	$(".video-overlay .right").mousedown("right",onMoveCamera);
	$(".video-overlay .down").mousedown("down",onMoveCamera);

	$(".camera-control-panel .zoom-in").mousedown("zoomIn",onMoveCamera);
	$(".camera-control-panel .zoom-out").mousedown("zoomOut",onMoveCamera);

	$(".camera-control-panel .snapshot").click(onSnapshot);

	$(".savecamerapos").bind("click", function(){
		var berthId = $('#berths').val();

		$.ajax({
			url: apiUrl + '/berths/' + berthId + '/positions/' + camera.id,
			type: 'PUT',
			dataType: 'json',
			data: camera.position,
			success: function(res) {},
			error:   function(err) { console.log("savecamerapos: error " + JSON.stringify(err)); }
		});
	});

	$(".loadcamerapos").bind("click", function(){
		var berthId = $('#berths').val();
		$.getJSON(apiUrl + '/berths/' + berthId + '/positions/' + camera.id, function(res){
			camera.moveTo(res);
		});
	});

	$(".fullscreen").bind("click", function(){
		toggleFullScreen($(".video-container").get(0));
	});

	$(".pause").bind("click", function(){
		player.stop(); // alternatively pause()
	});


	$(camera).on('move', function (event, pos) {
		$('.status').text("x: " + pos.x.toFixed(1) + "\xB0 y: " + pos.y.toFixed(1) + "\xB0 zoom: " + pos.zoom.toFixed(1) + "x");
	});

	$(camera).on('status', function (event, value) {
		var element = $(".status-indicator");

		element.removeClass("online offline disabled");
		element.addClass(value.status);
	});
};


function onPlayCamera() {
	if (!player) { return console.error("No player"); }
	//player.toggle();
	//if (!player.isPlaying) // Returns false even if the player has stopped
	player.play();
}


function onMoveCameraKey(command) {
	if (!camera) { return console.error("No camera"); }
	camera.move(command);
};
function onMoveCamera(event) {
	if (!camera) { return console.error("No camera"); }
	camera.move(event.data);
	$(document).bind("mouseup", onStopCamera);
};

function onStopCamera() {
	if (!camera) { return console.error("No camera"); }
	camera.stop();
	$(document).unbind("mouseup", onStopCamera);
}

function onSnapshot() {
	if (!camera) { return console.error("No camera"); }
	var snapshotWindow = window.open("","Snapshot","");
	camera.snapshot(function(err, result) {
		snapshotWindow.location = snapshotsUrl + "/" + result;
	});
}
