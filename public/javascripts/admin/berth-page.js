"use strict";

var apiUrl = config.apiUrl;
var newBerthPage = false;
var berth = null;

// LOAD DATA

// Client side redirect if sub-route points to a camera instance
var path = window.location.pathname;
path = path.match(/^\/admin\/berths(\/(.*))?$/)[2];
if (path) {
	if (path !== "new") {
		$.ajax({
			type: "get",
			url: apiUrl + "/berths/" + path,
			dataType: "json"
		})
		.done(function(berthData){
			berth = berthData;
			document.title = document.title + " | " + berthData.number;
			$(".berth-title").text(berthData.number + " - " + berthData.owner);

			fillForm(berthData);

			$(berthData.users).each(function(index, berthUser) {
				var listItem = '<li>' + berthUser.name + '<i class="fa fa-close pull-right"></i></li>';
				$(".users-list").append(listItem);
			});

			$(berthData.cameraPositions).each(function(index, position) {
				var listItem =
				'<li>\
<span class="title">\
	<a href="/admin/cameras/' + (position.camera && position.camera.slug) + '">' + ((position.camera && position.camera.title) || " ") + '</a>\
</span>\
<span class="position">x ' + position.x.toFixed(1) + '\u00B0</span>\
<span class="position">y ' + position.y.toFixed(1) + '\u00B0</span>\
<span class="position">' + position.zoom.toFixed(1) + 'x</span>\
<i class="fa fa-close pull-right"></i>\
</li>';

				$(".berth-positions-list").append(listItem);
			});
		})
		.fail();
	}
	else {
		newBerthPage = true;
	}
}

$(document).ready(function(){

	$("form").on("submit", function(e) {
		e.preventDefault();

		var data = $('form').serialize();
		var errorMessage = newBerthPage ? "Could not create new berth" : "Could not edit berth";
		var type = newBerthPage ? "post" : "put";

		send(type, data, errorMessage, true);

	});

	if (!newBerthPage) {
		$("#berthDelete").click(function(e) {
			send("delete", null, "Could not delete berth", true);
		});
	}

});


function send(type, data, errorMessage, redirect) {
	$.ajax({
		url: type === "post" ? apiUrl +'/berths' : apiUrl + '/berths/' + berth.id,
		type: type,
		dataType: data ? "json" : null,
		data: data,
		success: function(data) {
			if (redirect) {
				var redirectTo = '/admin/berths';
				// new vs. save, delete
				if (type === "post") { redirectTo +=  "/" + data.number; }
				document.location.href = redirectTo;
			}
		},
		error: function(e) {
			var message = errorMessage + ". " + e.responseText;
			$(".error").text(message);
		}
	});
}
