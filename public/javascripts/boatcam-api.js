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

	return boatCamApi;
})();
