/**
 * @requires ./canvaslayer.js
 */

L.SensorLayer = L.FeatureGroup.extend({
	initialize: function (opts) {
		L.FeatureGroup.prototype.initialize.call(this, opts)
		L.Util.setOptions(this, opts)
		let markers = [L.marker([51.1078, 17.0351], {title: 'i', 'pm2.5': 15, draggable:'true'}),
			L.marker([51.1098, 17.0341], {title: 'i', 'pm2.5': 10, draggable:'true'}),
			L.marker([51.1138, 17.0321], {title: 'i', 'pm2.5': 20, draggable:'true'}),
			L.marker([51.1098, 17.0321], {title: 'i', 'pm2.5': 1, draggable:'true'}),
			L.marker([51.2098, 17.0221], {title: 'i', 'pm2.5': 1, draggable:'true'}),
			L.marker([51.0098, 17.0421], {title: 'i', 'pm2.5': 1, draggable:'true'}),
			L.marker([51.0098, 17.0221], {title: 'i', 'pm2.5': 1, draggable:'true'})]

		for (let key in markers) {
			this.addLayer(markers[key])
		}

		var canvasTiles = new L.CanvasLayer({
			opacity: 0.5,
			getMarkers: () => {
				return markers //TODO: INDEX
			},
			getValue: (marker) => {
				return marker.options['pm2.5'];
			}
		})

		function dragend() {
			canvasTiles.redraw()
		}

		for (let key in markers) {
			markers[key].on('dragend', dragend)
		}

		this.addLayer(canvasTiles)
	}
})

L.sensorLayer = function (opts) {
	return new L.SensorLayer(opts)
}
