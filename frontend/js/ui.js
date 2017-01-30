/**
 * @requires ./main.js
 */

$(document).bind('mobileinit', function() {
	$.mobile.ajaxEnabled = false
	$.mobile.hashListeningEnabled = false
	$.mobile.pushStateEnabled = false
})

$(document).on('pagecontainershow', function() {
	resizeContent()
	$(window).on('resize orientationchange', function() {
		resizeContent()
	})
	map.invalidateSize()
})

function resizeContent() {
	scroll(0, 0)
	var content = $.mobile.getScreenHeight() - $('.ui-header').outerHeight() -
		$('.ui-footer').outerHeight() - $('.ui-content').outerHeight() +
		$('.ui-content').height()
	$('.ui-content').height(content)
}
