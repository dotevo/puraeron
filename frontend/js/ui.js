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
		login: function() {
			$('#popupLogin').popup('close')
		},
		logout: function() {
			$('#popupLogin').popup('close')
		},
		error: function(data) {
			$('#loginError').text(data.error)
		},
		status: function(data) {
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
		rest.register({name: $('#popupuser').val(), password: pass}, function(data) {
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

setInterval(function() {
	rest.status()
}, 60 * 1000)

function clearLoginForm() {
	$('#loginError').text('')
	$('#popupuser').val('')
	$('#popuppass').val('')
	$('#popuppass2').val('')
}

function onDeviceClicked(e) {
	rest.getDevice({id: $(this).attr('data-id')}, function(d) {
		popupDevice.open(d)
	})
}

function refreshMyDevices() {
	$('#devicesList > .device').remove()

	rest.getMyDevices(function(data) {
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

function createDevice(e) {
	popupDevice.open.bind(popupDevice)({create: true})
}

function uiInit() {
	$('#loginbutton').on('click', login)
	$('#registerButton').on('click', register)
	$('#logoutbutton').on('click', logout)
	$('#refreshMyDevicesButton').on('click', refreshMyDevices)
	$('#popupLogin').on('popupbeforeposition popupafteropen popupafterclose',
		clearLoginForm)
	$('#createDeviceButton').on('click', createDevice)
	rest.status()
}
