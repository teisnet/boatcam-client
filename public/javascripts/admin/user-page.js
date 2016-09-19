"use strict";

var newUserPage = false;
var userId = null;

// LOAD DATA

// Client side redirect if sub-route points to a camera instance
var path = window.location.pathname;
path = path.match(/^\/admin\/users(\/(.*))?$/)[2];
if (path) {
	if (path !== "new") {
		BoatCamApi.users.get(path)
		.done(function(userData){
			document.title = document.title + " | " + userData.name;
			$(".username").text(userData.name);
			userId = userData.id;
			fillForm(userData);

			$(userData.berths).each(function(index, userBerth) {
				var listItem = '<li data-berth-id="' + userBerth.id + '">' + userBerth.number + '<i class="fa fa-close pull-right delete-berth"></i></li>';
				$(".berths-list").append(listItem);
			});
		})
		.fail(function(err){
			console.error("Could not find berth with id=" + path);
		});
	}
	else {
		newUserPage = true;
	}
}

$(document).ready(function(){

	$("form").on("submit", function(e) {
		e.preventDefault();

		var serializedUserData = $('form').serialize();

		if (newUserPage) {
			// CREATE
			BoatCamApi.users.create(serializedUserData)
			.done(function(responseData){ document.location.href = '/admin/users/' + responseData.id; })
			.fail(function(err){ $(".error").text("Could not create new user (" + err.responseText + ")"); });
		}
		else {
			// SAVE
			BoatCamApi.users.save(userId, serializedUserData)
			.done(function(){ document.location.href = '/admin/users'; })
			.fail(function(err){ $(".error").text("Could not edit user (" + err.responseText + ")"); });
		}

	});

	if (!newUserPage) {
		$("#userDelete").click(function(e) {
			// DETETE
			BoatCamApi.users.delete(userId)
			.done(function(){ document.location.href = '/admin/users'; })
			.fail(function(err){ $(".error").text("Could not delete user (" + err.responseText + ")"); });
		});
	}

	$("ul.berths-list").on("click", "li .delete-berth", function() {
		var parent = $(this).parent("li");
		var berthId = parent.data("berth-id");
		console.log("Delete " + parent.data("berth-id"));

		BoatCamApi.berths.delete(berthId + '/users/' + userId)
		.success(function() {
			parent.remove();
		})
		.fail(function(err) {
			$(".error").text("Could not delete berth (" + err.responseText + ")");
		});
	});

});
