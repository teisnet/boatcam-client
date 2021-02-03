"use strict";

var socket = io(config.socketUrl + "/cameras");
var Camera = BoatCamApi.cameras; //new Api("cameras");

Camera.getAll()
.done(function(cameras) {
	$(cameras).each(function (index, camera) {
		var listItem = '<li id="'+ camera.id + '"><a href="cameras/' + camera.slug + '"><div class="status-indicator ' + camera.status.status + '"></div>' + camera.title + "</a></li>";
		$("ul.camera-list").append(listItem);
	});

	socket.on("status", function(status){
		$.isArray(status) ? status.forEach(function(value) { setStatus(value); }) : setStatus(status);
	});
});

function setStatus(status) {
	var element = $("#" + status.id + " .status-indicator");

	element.removeClass("online offline disabled");
	element.addClass(status.status);
}

socket.on("connect_error", errorHandler.bind(null, "connect_error") );
socket.on("connect", errorHandler.bind(null, "connect") );
socket.on("disconnect", errorHandler.bind(null, "disconnect") );
socket.on("connect_failed", errorHandler.bind(null, "connect_failed") );
socket.on("error", errorHandler.bind(null, "error") );


function errorHandler(event, test) {
	console.log("Event fired: " + event);
}
