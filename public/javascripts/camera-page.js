"use strict";

var apiUrl = config.apiUrl;
var snapshotsUrl = config.snapshotsUrl;

var player = null;
var camera = null;
var cameraId = null;
var down = {};
var berths = {};

// LOAD DATA
// Client side redirect if sub-route points to a camera instance
var path = window.location.pathname;
path = path.match(/^\/cameras(\/(.*))?$/)[2];
if (path) {
	BoatCamApi.cameras.get(path)
	.done(function(cameraData){
		cameraId = cameraData.id;
		var cameraUri = cameraData.uri;
		var slash = cameraUri.lastIndexOf("/");

		document.title = document.title + " | " + cameraData.title;
		$(".camera-title").text(cameraData.title);

		player = new Player(cameraData.uri);
		camera = new Camera(cameraData);
		initPlayer(player);
		initCamera(camera);

		BoatCamApi.cameras.get(cameraData.id + "/berths")
		.done(function(berthData) {
			berths = berthData.reduce(function(berths, berth) {
				berths[berth.id] = berth;
				return berths;
			}, {});

			$.each(berthData, function () {
				var $option = $("<option/>").val(this.id).text(this.number);
				$("select#berths").append($option);
			});
		});
	})
	.fail();
}

$(document).ready(function() {
	$("select#berths").change(function() {
		var berthId = this.value;
		$(".positions-list").empty();
		$(berths[berthId].positions).each(function(index, position) {
			var listItem =
			'<li data-position-id="' + position.id + '">\
				<span class="position">x ' + position.x.toFixed(1) + '\u00B0</span>\
				<span class="position">y ' + position.y.toFixed(1) + '\u00B0</span>\
				<span class="position">' + position.zoom.toFixed(1) + 'x</span>\
				<i class="fa fa-close pull-right delete-position"></i>\
			</li>';

			$(".positions-list").append(listItem);
		});

	});

	$("ul.positions-list").on("click", "li .delete-position", function(e) {
		e.stopPropagation();
		var parent = $(this).parent("li");
		var positionId = parent.data("position-id");

		BoatCamApi.cameras.delete(cameraId + '/positions/' + positionId)
		.success(function() {
			parent.remove();
		})
		.fail(function(err) {
			$(".error").text("Could not delete position (" + err.responseText + ")");
		});
	});


	$("ul.positions-list").on("click", "li", function() {
		var positionId = $(this).data("position-id");

		BoatCamApi.berths.get(cameraId + '/positions/' + positionId)
		.done(function(res) {
			camera.moveTo(res);
		});
	});

});


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

	$(".savecamerapos").on("click", function(){
		var berthId = $('#berths').val();
		BoatCamApi.berths.createRelation(berthId + '/positions/' + camera.id, camera.position)
		.success(function(position) {
			var listItem =
			'<li data-position-id="' + position.id + '">\
				<span class="position">x ' + position.x.toFixed(1) + '\u00B0</span>\
				<span class="position">y ' + position.y.toFixed(1) + '\u00B0</span>\
				<span class="position">' + position.zoom.toFixed(1) + 'x</span>\
				<i class="fa fa-close pull-right delete-position"></i>\
			</li>';
			$(".positions-list").append(listItem);
		})
		.fail(function(err) {
			console.log("savecamerapos: error " + JSON.stringify(err));
		});
	});

	$(".fullscreen").on("click", function(){
		toggleFullScreen($(".video-container").get(0));
	});

	$(".pause").on("click", function(){
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
	$(document).on("mouseup", onStopCamera);
};

function onStopCamera() {
	if (!camera) { return console.error("No camera"); }
	camera.stop();
	$(document).off("mouseup", onStopCamera);
}

function onSnapshot() {
	if (!camera) { return console.error("No camera"); }
	var snapshotWindow = window.open("","Snapshot","");
	camera.snapshot(function(err, result) {
		snapshotWindow.location = snapshotsUrl + "/" + result;
	});
}
