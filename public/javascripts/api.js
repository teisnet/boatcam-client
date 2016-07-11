"use strict";

function Api(route) {
	this.url = config.apiUrl + "/" + route;
}

Api.prototype.getAll = function(cb){
	return this.send(null, "get", null, cb);
};

Api.prototype.get = function(id, cb){
	return this.send(id, "get", null, cb);
}

Api.prototype.create = function(data, cb){
	return this.send(null, "post", data, cb);
}

Api.prototype.save = function(id, data, cb){
	return this.send(id, "put", data, cb);
}

Api.prototype.delete = function(id, cb){
	return this.send(id, "delete", null, cb);
}

Api.prototype.send = function(id, type, data, cb) {
	return $.ajax({
		url: id ? this.url + "/" + id : this.url,
		type: type,
		dataType: data ? "json" : null,
		data: data,
		success: function(data) { if (cb) cb(null, data); },
		error: function(err) { if (cb) cb(err); }
	});
}

/* GET
$.ajax({
			type: "get",
			url: apiUrl + "/berths/" + path,
			dataType: "json"
		})
		*/

/*
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
*/