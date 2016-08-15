"use strict";

function Auth(authenticationUrl) {
	var self = this;

	this.redirectTo = "/";
	this.authenticationUrl = authenticationUrl;
	this.LOCAL_TOKEN_KEY = "boatCamAuthToken";
	this.isAuthenticated = false;
	this.token = undefined;
	this.header = "Authorization";

	// TODO: Optionally check token at server upon initialization
	// Load user credentials
	var isLoginPage = document.location.pathname === "/login";
	if (isLoginPage) {
		self.redirectTo = window.sessionStorage.getItem("BoatCamRedirectTo") || "/";
		window.sessionStorage.removeItem("BoatCamRedirectTo");
	}

	var token = window.sessionStorage.getItem(self.LOCAL_TOKEN_KEY);
	if (token) {
		self._useCredentials(token);
	} else if (!isLoginPage) {
		window.sessionStorage.setItem("BoatCamRedirectTo", document.location.href);
		document.location.href = "/login";
	}
}


Auth.prototype.login = function(username, password, cb) {
	var self = this;
	$.ajax({
		type: "POST",
		url: self.authenticationUrl,
		data: { username: username, password: password },
		success: function(result) {
			if (result.success) {
				// Store user credentials
				window.sessionStorage.setItem(self.LOCAL_TOKEN_KEY, result.token);
				self._useCredentials(result.token);
				cb && cb(null, result.message);

				if (document.location.pathname === "/login") {
					document.location.href = self.redirectTo;
				}
			} else {
				cb && cb(result.message);
			}
		},
		error: function(err) {
			cb && cb(err.message);
		}
		//dataType: dataType
	})
}

Auth.prototype.logout = function() {
	this.token = undefined;
	this.isAuthenticated = false;
	window.sessionStorage.removeItem(this.LOCAL_TOKEN_KEY);
}

Auth.prototype._useCredentials = function(token) {
	// TODO: Invalidate token on server
	this.token = token;
	this.isAuthenticated = true;
}

// TODO: Deauthenticate if 404 Not authorized is recieved
