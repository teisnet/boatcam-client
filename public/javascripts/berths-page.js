"use strict";

BoatCamApi.berths.getAll()
.done(function(berths){
	$(berths).each(function (index, berth) {
		var listItem = '<li id="'+ berth.id + '"><a href="berths/' + berth.number + '">' + berth.number + " - " + berth.owner + "</a></li>";
		$("ul.camera-list").append(listItem);
	});
});
