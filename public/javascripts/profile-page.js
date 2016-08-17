"use strict";

BoatCamApi.getUser()
.done(function(userData){
	document.title = document.title + " | " + userData.name;
	$(".username").text(userData.name);

	fillForm(userData);
})
.fail(function(){
	console.error("Could not find user profile");
});


$(document).ready(function(){

	$("form").on("submit", function(e) {
		e.preventDefault();

		var serializedUserData = $('form').serialize();
		var userId = $("form input:hidden[name='id']").val();

		// SAVE
		BoatCamApi.users.save(userId, serializedUserData)
		.done(function(){ $(".error").text("Saved changes"); })
		.fail(function(err){ $(".error").text("Could not edit user profile (" + err.responseText + ")"); });

	});

});
