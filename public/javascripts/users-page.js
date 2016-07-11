"use strict";

var User = new Api("users");

User.getAll()
.done(function(usersData) {
	$(usersData).each(function (index, user) {
		var listItem = '<li id="'+ user.id + '"><a href="users/' + user.id + '">' + user.name + "</a></li>";
		$("ul.camera-list").append(listItem);
	});
});