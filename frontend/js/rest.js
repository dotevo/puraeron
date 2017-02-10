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
			success: (data) => {
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
			success: (data) => {
				if (data.status == 'OK') {
					_this.opts.auth.logout(data)
					_this.opts.auth.status({status: 'OUT'})
				} else {
					_this.opts.auth.error(data)
				}
			},
			error: (data) => {
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
			success: (data) => {
				if (data.status == 'OK') {
					_this.opts.auth.status(data)
				} else {
					console.log(data)
				}
			},
			error: (data) => {
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
			success: (data) => {
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
			success: (data) => {
				callback(data)
			},
			error: (data) => {
				if (data.statusText == 'Unauthorized') {
					_this.opts.auth.status({status: 'OUT'})
				}
			},
			dataType: 'json'
		})
	}
	//////////////////Measurement////////////////
	get24hMeasurements(opt, callback) {
		$.ajax({
			type: 'GET',
			url: '/api/measurement/bbox/' + opt.bl + '/' + opt.ur + '/' + opt.h,
			success: (data) => {
				callback(data)
			},
			dataType: 'json'
		})
	}
}
