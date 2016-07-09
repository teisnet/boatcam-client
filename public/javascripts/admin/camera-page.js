"use strict";

var apiUrl = config.apiUrl;
var newCameraPage = false;
var camera = null;

// LOAD DATA

// Client side redirect if sub-route points to a camera instance
var path = window.location.pathname;
path = path.match(/^\/admin\/cameras(\/(.*))?$/)[2];
if (path) {
	if (path !== "new") {
		$.ajax({
			type: "get",
			url: apiUrl + "/cameras/" + path,
			dataType: "json"
		})
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


			camera = cameraData;

			initCamera(cameraData.slug);
		})
		.fail();
	}
	else {
		newCameraPage = true;
	}
}


$(document).ready(function(){

	$("form").on("submit", function(e) {
		e.preventDefault();

		var formData = $('form').serialize();

		if (!formData.match("enabled")) {
			formData = formData.concat("&enabled=false");
		}

		var errorMessage = newCameraPage ? "Could not create new camera" : "Could not edit camera";
		var type = newCameraPage ? "post" : "put";
		send(type, formData, errorMessage, true);

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
			send("delete", null, "Could not delete camera", true);
		});

		$('form #enabled').change(function() {
			var isChecked = $(this).is(':checked');
			send("put", { enabled: isChecked }, "Could not set camera enabled = " + JSON.stringify(isChecked));
		});

	});
}


function send(type, data, errorMessage, redirect) {
	$.ajax({
		url: type === "post" ? apiUrl +'/cameras' : apiUrl + '/cameras/' + camera._id,
		type: type,
		dataType: data ? "json" : null,
		data: data,
		success: function(data) {
			if (redirect) {
				var redirectTo = '/admin/cameras';
				// new vs. save, delete
				if (type === "post") { redirectTo +=  "/" + data.slug; }
				document.location.href = redirectTo;
			}
		},
		error: function(e) {
			var message = errorMessage + ". " + e.responseText;
			$(".error").text(message);
		}
	});
}
