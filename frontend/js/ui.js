/**
 * @requires ./rest.js
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

let rest = new Rest({
	auth: {
		login: () => {
			$('#popupLogin').popup('close')
		},
		logout: () => {
			$('#popupLogin').popup('close')
		},
		error: (data) => {
			$('#loginError').text(data.error)
		},
		status: (data) => {
			if (data.status == 'OK') {
				console.log(data)
				$('#loginpopupbutton').text('Login: ' + data.name)
				$('#loginDiv').hide()
				$('#logoutDiv').show()
			} else if (data.status == 'OUT') {
				$('#loginpopupbutton').text('Login')
				$('#logoutDiv').hide()
				$('#loginDiv').show()
			}
		}
	}
})

function login(event) {
	rest.login({
			name: $('#popupuser').val(),
			password: $('#popuppass').val()
		})
}

function logout(event) {
	rest.logout()
}

setInterval(() => {
	rest.status()
}, 60 * 1000)

function clearLoginForm(event) {
	$('#loginError').text('')
	$('#popupuser').val('')
	$('#popuppass').val('')
}

function uiInit() {
	$('#loginbutton').on('click', login)
	$('#logoutbutton').on('click', logout)
	$('#popupLogin').on('popupbeforeposition popupafteropen popupafterclose',
	 clearLoginForm);
	rest.status()
}
