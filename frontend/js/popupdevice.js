let popupDevice

var data = {
	labels: ["January", "February", "March", "April", "May", "June", "July"],
	datasets: [
		{
			label: "My First dataset",
			fillColor: "rgba(220,220,220,0.2)",
			strokeColor: "rgba(220,220,220,1)",
			pointColor: "rgba(220,220,220,1)",
			pointStrokeColor: "#fff",
			pointHighlightFill: "#fff",
			pointHighlightStroke: "rgba(220,220,220,1)",
			data: [65, 59, 80, 81, 56, 55, 40]
		},
		{
			label: "My Second dataset",
			fillColor: "rgba(151,187,205,0.2)",
			strokeColor: "rgba(151,187,205,1)",
			pointColor: "rgba(151,187,205,1)",
			pointStrokeColor: "#fff",
			pointHighlightFill: "#fff",
			pointHighlightStroke: "rgba(151,187,205,1)",
			data: [28, 48, 40, 19, 86, 27, 90]
		}
	]
}



class DevicePopup {
	constructor() {
		this.minimap = L.map('minimap').setView([51.1098, 17.0351], 13)
		const osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
		const osm = new L.TileLayer(osmUrl, {
			maxZoom: 19,
			opacity: 0.7,
			attribution: 'Dane mapy <a href="http://osm.org">OpenStreetmap<a/>'})
		this.minimap.addLayer(osm)
		this.marker = L.marker([0, 0], {draggable:'true'}).addTo(this.minimap)
	}

	init() {
		let self = this
		$('#deviceTabs').tabs({
			activate: function(event, ui) {
				$('#devicePopup').popup('reposition', {
					'positionTo': 'window'})
				self.minimap.invalidateSize()
				rest.getDeviceMeasurements({id: self.id, h: 24}, function(d) {
					self.refreshChart(d)
				})
			}
		})
		$('#deviceClose').on('click', function() {
			closeWindow()
		})

		$('#deviceSave').on('click', this.onSaveClicked.bind(this))
	}

	refreshChart(d) {
		var data = [
		];

		let values = {}
		for (let k in d) {
			for(let n in d[k].values) {
				if(values[n] == null) {
					data.push({x:[], y:[], name: n, yaxis: n, type: 'scatter'})
					values[n] = data.length - 1
				}
				data[values[n]].x.push(new Date(d[k].date))
				data[values[n]].y.push(d[k].values[n])
			}
		}

		Plotly.newPlot('chartPlace', data)
	}

	onSaveClicked() {
		const self = this;
		if (this.create == true) {
			rest.createDevice({"password": $('#devicePass').val(),
				"name": $('#deviceName').val(),
				"loc":  [this.marker.getLatLng().lat, this.marker.getLatLng().lng]},
				function(data){
					console.log('s')
					console.log(data)
					self.closeWindow()
				})
		} else {
			let data = {}
			data.loc = [this.marker.getLatLng().lat, this.marker.getLatLng().lng]
			data.name = $('#deviceName').val()
			if ($('#devicePass').val().length) {
				data.password = $('#devicePass').val()
			}
			rest.updateDevice({id: this.id, data: data}, function(data) {
				self.closeWindow()
			})
			console.log('save')
		}
	}

	open(device) {
		if (device['editable'] || device['create']) {
			$('#passwordBox').show()
			$('#deviceSave').show()
			$('#deviceClose').hide()
			$('#deviceName').attr('readonly', false)
		} else {
			$('#passwordBox').hide()
			$('#deviceSave').hide()
			$('#deviceClose').show()
			$('#deviceName').attr('readonly', true)
		}
		$('#deviceName').val(device.name)
		$('#deviceId').text(device._id)
		$('#devicePopup').popup('open')
		this.minimap.invalidateSize()
		if (device.loc == null) {
			device.loc = [0,0]
		}
		this.minimap.setView(device.loc, 10)
		this.marker.setLatLng(device.loc)

		this.create = device.create
		this.id = device._id

		const self = this
	}

	closeWindow() {
		$('#devicePopup').popup('close')
	}
}

popupDevice = new DevicePopup()
$(document).bind('pagecreate', function() {
	popupDevice.init()
})
