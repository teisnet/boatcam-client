"use strict";

var apiUrl = config.apiUrl;

// LOAD DATA
$.getJSON(apiUrl + "/berths", function(berthsData) {
	$(berthsData).each(function (index, berth) {
		var listItem = '<li id="'+ berth.id + '"><a href="berths/' + berth.number + '">' + berth.number + " - " + berth.owner + "</a></li>";
		$("ul.camera-list").append(listItem);
	});
});
