"use strict";

function toggleFullScreen(element) {
	var requestMethod = null;
	var caller = null;
	if (!document.fullscreenElement &&    // alternative standard method
		!document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
		requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullscreen;
		caller = element;
	}
	else {
		requestMethod = document.exitFullscreen || document.msExitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen;
		caller = document;
	}

	if (requestMethod) { // Native full screen
		requestMethod.call(caller);
	}
	else if (typeof window.ActiveXObject !== "undefined") { // Older IE
		var wscript = new ActiveXObject("WScript.Shell");
		if (wscript !== null) {
			wscript.SendKeys("{F11}");
		}
	}
}


var nextTick = (function () {
	var canSetImmediate = typeof window !== 'undefined'
	&& window.setImmediate;
	var canPost = typeof window !== 'undefined'
	&& window.postMessage && window.addEventListener;

	if (canSetImmediate) {
		return function (f) { return window.setImmediate(f) };
	}

	if (canPost) {
		var queue = [];
		window.addEventListener('message', function (ev) {
			var source = ev.source;
			if ((source === window || source === null) && ev.data === 'process-tick') {
				ev.stopPropagation();
				if (queue.length > 0) {
					var fn = queue.shift();
					fn();
				}
			}
		}, true);

		return function nextTick(fn) {
			queue.push(fn);
			window.postMessage('process-tick', '*');
		};
	}

	return function nextTick(fn) {
		setTimeout(fn, 0);
	};
})();


function fillForm(data) {
	$.each(data, function(name, val){
		var $el = $('[name="'+name+'"]'),
			type = $el.attr('type');

		switch(type){
			case 'checkbox':
				$el.attr('checked', 'checked');
				break;
			case 'radio':
				$el.filter('[value="'+val+'"]').attr('checked', 'checked');
				break;
			default:
				$el.val(val);
		}
	});
}
