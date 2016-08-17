"use strict";

var BoatCamApi = (function() {

	var boatCamApi = {};

	var auth = boatCamApi.auth = new Auth(config.apiUrl + "/authenticate");

	if (window.Api !== undefined) {
		boatCamApi.cameras = new Api("cameras");
		boatCamApi.berths = new Api("berths");
		boatCamApi.users = new Api("users");

		if (auth.isAuthenticated) {
			boatCamApi.cameras.setHeader(auth.header, auth.token);
			boatCamApi.berths.setHeader(auth.header, auth.token);
			boatCamApi.users.setHeader(auth.header, auth.token);
		}
	}

	boatCamApi.getUser = function(cb) {
		return $.ajax({
			url: config.apiUrl + "/user",
			type: "get",
			cache: false,
			beforeSend: function(xhr) {
				if (auth.header && auth.token) { xhr.setRequestHeader(auth.header, auth.token);
			} },
			success: function(user) { if (cb) cb(null, user); },
			error: function(err) { if (cb) cb(err); }
		});
	}

	return boatCamApi;
})();


BoatCamApi.getUser()
.done(function(user) {
	// Do this immediately if DOM is loaded, or once it's loaded otherwise
	$(document).ready(function() {
		$(".profile").text(user.username);
	});
});

$(document).ready(function() {
	$('a.logout').click(function(){
		BoatCamApi.auth.logout();
		return false;
	});
});
