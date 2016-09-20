"use strict";

var newBerthPage = false;
var berthId = null;

// LOAD DATA

// Client side redirect if sub-route points to a camera instance
var path = window.location.pathname;
path = path.match(/^\/admin\/berths(\/(.*))?$/)[2];
if (path) {
	if (path !== "new") {
		BoatCamApi.berths.get(path)
		.done(function(berthData){
			berthId = berthData.id;
			document.title = document.title + " | " + berthData.number;
			$(".berth-title").text(berthData.number + " - " + berthData.owner);

			fillForm(berthData);

			$(berthData.users).each(function(index, berthUser) {
				var listItem = '<li data-user-id="' + berthUser.id + '">' + berthUser.name + '<i class="fa fa-close pull-right delete-user"></i></li>';
				$(".users-list").append(listItem);
			});

			$(berthData.cameras).each(function(index, camera) {
				var position = camera.CameraPosition;
				var listItem =
				'<li data-camera-id="' + camera.id + '">\
<span class="title">\
	<a href="/admin/cameras/' + (camera && camera.slug) + '">' + ((camera && camera.title) || " ") + '</a>\
</span>\
<span class="position">x ' + position.x.toFixed(1) + '\u00B0</span>\
<span class="position">y ' + position.y.toFixed(1) + '\u00B0</span>\
<span class="position">' + position.zoom.toFixed(1) + 'x</span>\
<i class="fa fa-close pull-right delete-position"></i>\
</li>';

				$(".berth-positions-list").append(listItem);
			});
		})
		.fail(function(err){
			console.error("Could not find berth with id=" + path);
		});
	}
	else {
		newBerthPage = true;
	}
}

$(document).ready(function(){

	$("form").on("submit", function(e) {
		e.preventDefault();

		var serializedBerthData = $('form').serialize();

		if (newBerthPage) {
			// CREATE
			BoatCamApi.berths.create(serializedBerthData)
			.done(function(responseData){ document.location.href = '/admin/berths/' + responseData.number; })
			.fail(function(err){ $(".error").text("Could not create new berth (" + err.responseText + ")"); });
		}
		else {
			// SAVE
			BoatCamApi.berths.save(berthId, serializedBerthData)
			.done(function(){ document.location.href = '/admin/berths'; })
			.fail(function(err){ $(".error").text("Could not edit berth (" + err.responseText + ")"); });
		}

	});

	if (!newBerthPage) {
		$("#berthDelete").click(function(e) {
			// DETETE
			BoatCamApi.berths.delete(berthId)
			.done(function(){ document.location.href = '/admin/berths'; })
			.fail(function(err){ $(".error").text("Could not delete berth (" + err.responseText + ")"); });
		});
	}


	$("ul.berth-positions-list").on("click", "li .delete-position", function() {
		var parent = $(this).parent("li");
		var cameraId = parent.data("camera-id");
		console.log("Delete " + parent.data("camera-id"));

		BoatCamApi.berths.delete(berthId + '/positions/' + cameraId)
		.success(function() {
			parent.remove();
		})
		.fail(function(err) {
			$(".error").text("Could not delete camera position (" + err.responseText + ")");
		});
	});

	$("ul.users-list").on("click", "li .delete-user", function() {
		var parent = $(this).parent("li");
		var userId = parent.data("user-id");
		console.log("Delete " + parent.data("user-id"));

		BoatCamApi.berths.delete(berthId + '/users/' + userId)
		.success(function() {
			parent.remove();
		})
		.fail(function(err) {
			$(".error").text("Could not delete user (" + err.responseText + ")");
		});
	});

});
