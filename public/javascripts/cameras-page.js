"use strict";

var socket = io(config.socketUrl + "/cameras");
var Camera = BoatCamApi.cameras; //new Api("cameras");

Camera.getAll()
.done(function(cameras) {
	$(cameras).each(function (index, camera) {
		var listItem = '<li id="'+ camera._id + '"><a href="cameras/' + camera.slug + '"><div class="status-indicator"></div>' + camera.title + "</a></li>";
		$("ul.camera-list").append(listItem);
	});
});

socket.on("status", function(status){
	$.isArray(status) ? status.forEach(function(value) { setStatus(value); }) : setStatus(status);
});

function setStatus(status) {
	var element = $("#" + status._id + " .status-indicator");

	element.removeClass("online offline disabled");
	element.addClass(status.status);
}
