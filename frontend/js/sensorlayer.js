/**
 * @requires ./canvaslayer.js
 * @requires ./rest.js
 * @requires ./ui.js
 */

L.SensorLayer = L.FeatureGroup.extend({
	initialize: function (opts) {
		L.FeatureGroup.prototype.initialize.call(this, opts)
		L.Util.setOptions(this, opts)
		let markers = []

		function clicked(e) {
			const device = e.target.options['id']
			opts.showDeviceData({id: device})
		}

		function dragend() {
			canvasTiles.redraw()
		}
		let _this = this
		//Temp. download all
		rest.getBboxMeasurements({bl: '-100,-100',ur: '100,100', h:'1'}, function(data) {
			for (let k in data) {
				let marker = L.marker(data[k]['loc'],
					{title: 'i', id: data[k]['device'], 'pm2.5': data[k]['values']['pm25'], draggable:'true'})
				marker.on('click', clicked)
				marker.on('dragend', dragend)
				_this.addLayer(marker)
				markers.push(marker)
			}
			canvasTiles.redraw()
		})

		var canvasTiles = new L.CanvasLayer({
			opacity: 0.5,
			getMarkers: function () {
				return markers //TODO: INDEX
			},
			getValue: function (marker) {
				return marker.options['pm2.5'];
			}
		})

		this.addLayer(canvasTiles)
	}
})

L.sensorLayer = function (opts) {
	return new L.SensorLayer(opts)
}
