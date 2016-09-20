"use strict";

var newCameraPage = false;
var cameraId = null;

// LOAD DATA

// Client side redirect if sub-route points to a camera instance
var path = window.location.pathname;
path = path.match(/^\/admin\/cameras(\/(.*))?$/)[2];
if (path) {
	if (path !== "new") {
		BoatCamApi.cameras.get(path)
		.done(function(cameraData){
			cameraId = cameraData.id;
			document.title = document.title + " | " + cameraData.title;
			$(".camera-title").text(cameraData.title);
			$(".camera-title").attr("href", "/cameras/" + cameraData.slug);
			$(".camera-shortcut").attr("href", "http://" + cameraData.username + ":" + cameraData.password + "@" + cameraData.hostname + ":" + cameraData.http);

			fillForm(cameraData);

			$(cameraData.berths).each(function(index, berth) {
				var position = berth.CameraPosition;
				var listItem =
				'<li data-berth-id="' + berth.id + '">\
					<span class="number">\
						<a href="/admin/berths/' + (berth && berth.number) + '">' + (berth && berth.number) + '</a>\
					</span>\
					<span class="position">x ' + position.x.toFixed(1) + '\u00B0</span>\
					<span class="position">y ' + position.y.toFixed(1) + '\u00B0</span>\
					<span class="position">' + position.zoom.toFixed(1) + 'x</span>\
					<i class="fa fa-close pull-right delete-position"></i>\
				</li>';

				$(".camera-positions-list").append(listItem);
			});

			initCamera(cameraData.slug);
		})
		.fail(function(err){
			console.error("Could not find camera with id=" + path);
		});
	}
	else {
		newCameraPage = true;
	}
}


$(document).ready(function(){

	$("form").on("submit", function(e) {
		e.preventDefault();

		var serializedCameraData = $('form').serialize();
		if (!serializedCameraData.match("enabled")) {
			serializedCameraData = serializedCameraData.concat("&enabled=false");
		}

		if (newCameraPage) {
			// CREATE
			BoatCamApi.cameras.create(serializedCameraData)
			.done(function(responseData){ document.location.href = '/admin/cameras/' + responseData.slug; })
			.fail(function(err){ $(".error").text("Could not create new camera (" + err.responseText + ")"); });
		}
		else {
			// SAVE
			BoatCamApi.cameras.save(cameraId, serializedCameraData)
			.done(function(){ document.location.href = '/admin/cameras'; })
			.fail(function(err){ $(".error").text("Could not edit camera (" + err.responseText + ")"); });
		}

	});

	$("ul.camera-positions-list").on("click", "li .delete-position", function() {
		var parent = $(this).parent("li");
		var berthId = parent.data("berth-id");
		console.log("Delete " + parent.data("berth-id"));

		BoatCamApi.berths.delete(berthId + '/positions/' + cameraId)
		.success(function() {
			parent.remove();
		})
		.fail(function(err) {
			$(".error").text("Could not delete camera position (" + err.responseText + ")");
		});
	});

});

function initCamera(cameraSlug) {
	var socket = io(config.socketUrl +"/cameras/" + cameraSlug);

	socket.on("status", function(value) {
		var element = $(".status-indicator");
		element.removeClass("online offline disabled");
		element.addClass(value.status);
	});

	$(document).ready(function() {

		$("#cameraDelete").click(function() {
			// DETETE
			BoatCamApi.cameras.delete(cameraId)
			.done(function(){ document.location.href = '/admin/cameras'; })
			.fail(function(err){ $(".error").text("Could not delete camera (" + err.responseText + ")"); });
		});

		$('form #enabled').change(function() {
			var isChecked = $(this).is(':checked');
			BoatCamApi.cameras.save(cameraId, { enabled: isChecked })
			.fail(function(err){
				$(".error").text("Could not set camera enabled = " + JSON.stringify(isChecked) + " (" + err.responseText + ")");
			});
		});

	});
}
