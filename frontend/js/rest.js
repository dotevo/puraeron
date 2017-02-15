class Rest{
	constructor(opts) {
		this.opts = opts
	}

	/*IN: {
		"name": "user",
		"password": "1234"
	}*/
	login(data) {
		const _this = this
		$.ajax({
			type: 'POST',
			url: '/api/auth/login',
			data: data,
			success: function(data) {
				if (data.status == 'OK') {
					_this.opts.auth.login(data)
					_this.opts.auth.status(data)
				} else {
					_this.opts.auth.error(data)
				}
			},
			dataType: 'json'
		})
	}

	/*IN: EMPTY*/
	logout(data) {
		const _this = this
		$.ajax({
			type: 'POST',
			url: '/api/auth/logout',
			data: data,
			success: function(data) {
				if (data.status == 'OK') {
					_this.opts.auth.logout(data)
					_this.opts.auth.status({status: 'OUT'})
				} else {
					_this.opts.auth.error(data)
				}
			},
			error: function(data) {
				if (data.statusText == 'Unauthorized') {
					_this.opts.auth.status({status: 'OUT'})
				}
			},
			dataType: 'json'
		})
	}

	/*IN: EMPTY*/
	status(data) {
		const _this = this
		$.ajax({
			type: 'GET',
			url: '/api/auth',
			data: data,
			success: function(data) {
				if (data.status == 'OK') {
					_this.opts.auth.status(data)
				} else {
					console.log(data)
				}
			},
			error: function(data) {
				if (data.statusText == 'Unauthorized') {
					_this.opts.auth.status({status: 'OUT'})
				}
			},
			dataType: 'json'
		})
	}
	/////////////////User////////////////////
	register(data, callback) {
		$.ajax({
			type: 'POST',
			url: '/api/user',
			data: data,
			success: function(data) {
				callback(data)
			},
			dataType: 'json'
		})
	}
	//////////////////DEVICE/////////////////
	getMyDevices(callback) {
		const _this = this
		$.ajax({
			type: 'GET',
			url: '/api/device/my',
			success: function(data) {
				callback(data)
			},
			error: function(data) {
				if (data.statusText == 'Unauthorized') {
					_this.opts.auth.status({status: 'OUT'})
				}
			},
			dataType: 'json'
		})
	}

	getDevice(opt, callback) {
		const _this = this
		$.ajax({
			type: 'GET',
			url: '/api/device/id/' + opt.id,
			success: function(data) {
				callback(data)
			},
			dataType: 'json'
		})
	}

	//{ "password": "pass", "name": "olbin", "loc": [51.1164, 17.0228] }
	createDevice(data, callback) {
		const _this = this
		$.ajax({
			type: 'POST',
			url: '/api/device',
			data: data,
			success: function(data) {
				callback(data)
			},
			dataType: 'json',
			error: function(data) {
				if (data.statusText == 'Unauthorized') {
					_this.opts.auth.status({status: 'OUT'})
				}
			}
		})
	}

	updateDevice(opt, callback) {
		const _this = this
		$.ajax({
			type: 'PUT',
			url: '/api/device/id/' + opt.id,
			data: opt.data,
			success: function(data) {
				callback(data)
			},
			dataType: 'json',
			error: function(data) {
				if (data.statusText == 'Unauthorized') {
					_this.opts.auth.status({status: 'OUT'})
				}
			}
		})
	}
	//////////////////Measurement////////////////
	getBboxMeasurements(opt, callback) {
		$.ajax({
			type: 'GET',
			url: '/api/measurement/bbox/' + opt.bl + '/' + opt.ur + '/' + opt.h,
			success: function(data) {
				callback(data)
			},
			dataType: 'json'
		})
	}

	getDeviceMeasurements(opt, callback) {
		$.ajax({
			type: 'GET',
			url: '/api/measurement/device/' + opt.id + '/' + opt.h,
			success: function(data) {
				callback(data)
			},
			dataType: 'json'
		})
	}
}
