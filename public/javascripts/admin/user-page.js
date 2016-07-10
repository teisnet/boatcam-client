"use strict";

var newUserPage = false;
var User = new Api("users");

// LOAD DATA

// Client side redirect if sub-route points to a camera instance
var path = window.location.pathname;
path = path.match(/^\/admin\/users(\/(.*))?$/)[2];
if (path) {
	if (path !== "new") {
		User.get(path)
		.done(function(userData){
			document.title = document.title + " | " + userData.name;
			$(".username").text(userData.name);

			fillForm(userData);

			$(userData.berths).each(function(index, userBerth) {
				var listItem = '<li>' + userBerth.number + '<i class="fa fa-close pull-right"></i></li>';
				$(".camera-positions-list").append(listItem);
			});
		})
		.fail(function(){
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
		var userId = $("form input:hidden[name='id']").val();

		if (newUserPage) {
			// CREATE
			User.create(serializedUserData)
			.done(function(responseData){ document.location.href = '/admin/users/' + responseData.id; })
			.fail(function(err){ $(".error").text("Could not create new user (" + err.responseText + ")"); });
		}
		else {
			// SAVE
			User.save(userId, serializedUserData)
			.done(function(){ document.location.href = '/admin/users'; })
			.fail(function(err){ $(".error").text("Could not edit user (" + err.responseText + ")"); });
		}

	});

	if (!newUserPage) {
		$("#userDelete").click(function(e) {
			// DETETE
			var userId = $("form input:hidden[name='id']").val();

			User.delete(userId)
			.done(function(){ document.location.href = '/admin/users'; })
			.fail(function(err){ $(".error").text("Could not delete user (" + err.responseText + ")"); });
		});
	}

});
