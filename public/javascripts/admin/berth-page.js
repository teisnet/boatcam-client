"use strict";

var newBerthPage = false;

// LOAD DATA

// Client side redirect if sub-route points to a camera instance
var path = window.location.pathname;
path = path.match(/^\/admin\/berths(\/(.*))?$/)[2];
if (path) {
	if (path !== "new") {
		BoatCamApi.berths.get(path)
		.done(function(berthData){

			document.title = document.title + " | " + berthData.number;
			$(".berth-title").text(berthData.number + " - " + berthData.owner);

			fillForm(berthData);

			$(berthData.users).each(function(index, berthUser) {
				var listItem = '<li>' + berthUser.name + '<i class="fa fa-close pull-right"></i></li>';
				$(".users-list").append(listItem);
			});

			$(berthData.cameras).each(function(index, camera) {
				var position = camera.CameraPosition;
				var listItem =
				'<li>\
<span class="title">\
	<a href="/admin/cameras/' + (camera && camera.slug) + '">' + ((camera && camera.title) || " ") + '</a>\
</span>\
<span class="position">x ' + position.x.toFixed(1) + '\u00B0</span>\
<span class="position">y ' + position.y.toFixed(1) + '\u00B0</span>\
<span class="position">' + position.zoom.toFixed(1) + 'x</span>\
<i class="fa fa-close pull-right"></i>\
</li>';

				$(".berth-positions-list").append(listItem);
			});
		})
		.fail(function(){
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
		var berthId = $("form input:hidden[name='id']").val();

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
			var berthId = $("form input:hidden[name='id']").val();

			BoatCamApi.berths.delete(berthId)
			.done(function(){ document.location.href = '/admin/berths'; })
			.fail(function(err){ $(".error").text("Could not delete berth (" + err.responseText + ")"); });
		});
	}

});
