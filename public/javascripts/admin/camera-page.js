"use strict";

var newCameraPage = false;
var Camera = new Api("cameras");

// LOAD DATA

// Client side redirect if sub-route points to a camera instance
var path = window.location.pathname;
path = path.match(/^\/admin\/cameras(\/(.*))?$/)[2];
if (path) {
	if (path !== "new") {
		Camera.get(path)
		.done(function(cameraData){
			document.title = document.title + " | " + cameraData.title;
			$(".camera-title").text(cameraData.title);
			$(".camera-title").attr("href", "/cameras/" + cameraData.slug);
			$(".camera-shortcut").attr("href", "http://" + cameraData.username + ":" + cameraData.password + "@" + cameraData.hostname + ":" + cameraData.http);

			fillForm(cameraData);

			$(cameraData.positions).each(function(index, position) {
				var listItem =
				'<li>\
					<span class="number">\
						<a href="/admin/berths/' + (position.berth && position.berth.number) + '">' + (position.berth && position.berth.number) + '</a>\
					</span>\
					<span class="position">x ' + position.x.toFixed(1) + '\u00B0</span>\
					<span class="position">y ' + position.y.toFixed(1) + '\u00B0</span>\
					<span class="position">' + position.zoom.toFixed(1) + 'x</span>\
					<i class="fa fa-close pull-right"></i>\
				</li>';

				$(".camera-positions-list").append(listItem);
			});

			initCamera(cameraData.slug);
		})
		.fail(function(){
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
		var cameraId = $("form input:hidden[name='id']").val();

		if (newCameraPage) {
			// CREATE
			Camera.create(serializedCameraData)
			.done(function(responseData){ document.location.href = '/admin/cameras/' + responseData.slug; })
			.fail(function(err){ $(".error").text("Could not create new camera (" + err.responseText + ")"); });
		}
		else {
			// SAVE
			Camera.save(cameraId, serializedCameraData)
			.done(function(){ document.location.href = '/admin/cameras'; })
			.fail(function(err){ $(".error").text("Could not edit camera (" + err.responseText + ")"); });
		}

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
			var cameraId = $("form input:hidden[name='id']").val();

			Camera.delete(cameraId)
			.done(function(){ document.location.href = '/admin/cameras'; })
			.fail(function(err){ $(".error").text("Could not delete camera (" + err.responseText + ")"); });
		});

		$('form #enabled').change(function() {
			var cameraId = $("form input:hidden[name='id']").val();
			var isChecked = $(this).is(':checked');
			Camera.save(cameraId, { enabled: isChecked })
			.fail(function(err){
				$(".error").text("Could not set camera enabled = " + JSON.stringify(isChecked) + " (" + err.responseText + ")");
			});
		});

	});
}
