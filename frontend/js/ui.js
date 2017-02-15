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
				$('#loginpopupbutton').text('Login: ' + data.name)
				$('#loginDiv').hide()
				$('#logoutDiv, #devicesButton').show()
			} else if (data.status == 'OUT') {
				$('#loginpopupbutton').text('Login')
				$('#logoutDiv, #devicesButton').hide()
				$('#loginDiv').show()
			}
			refreshMyDevices()
		}
	}
})

function login() {
	rest.login({
		name: $('#popupuser').val(),
		password: $('#popuppass').val()
	})
}

function register() {
	const pass = $('#popuppass').val()
	const pass2 = $('#popuppass2').val()
	if (pass == pass2) {
		rest.register({name: $('#popupuser').val(), password: pass}, (data) => {
			if (data.status == 'OK') {
				$('#popupLogin').popup('close')
			} else {
				$('#loginError').text(data.error)
			}
		})
	} else {
		$('#loginError').text('Różne hasła!')
	}
}

function logout() {
	rest.logout()
}

setInterval(() => {
	rest.status()
}, 60 * 1000)

function clearLoginForm() {
	$('#loginError').text('')
	$('#popupuser').val('')
	$('#popuppass').val('')
	$('#popuppass2').val('')
}

function onDeviceClicked(e) {
	rest.getDevice({id: $(this).attr('data-id')}, (d) => {
		popupDevice.open(d)
	})
}

function refreshMyDevices() {
	$('#devicesList > .device').remove()

	rest.getMyDevices((data) => {
		for (let k in data) {
			console.log(data[k])
			let b = $('<li data-icon="gear" class="device" data-id="' + data[k]['_id'] + '"><a>' +
				data[k].name +
				'</a></li>')
			$('#devicesList > [data-icon=refresh]').after(b)
			b.on('click', onDeviceClicked)
		}
		$('#devicesList').listview('refresh')
	})
}

function uiInit() {
	$('#loginbutton').on('click', login)
	$('#registerButton').on('click', register)
	$('#logoutbutton').on('click', logout)
	$('#refreshMyDevicesButton').on('click', refreshMyDevices)
	$('#popupLogin').on('popupbeforeposition popupafteropen popupafterclose',
		clearLoginForm)
	rest.status()
}
