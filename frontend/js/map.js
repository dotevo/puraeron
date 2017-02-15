let map

/**
 * @requires ./sensorlayer.js
 */
function showDeviceData(data) {
	rest.getDevice({id: data.id, h:1}, (d) => {
		popupDevice.open(d)
	})
}

function mapInit() {
	map = L.map('map').setView([51.1098, 17.0351], 13)
	const osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
	const osm = new L.TileLayer(osmUrl, {
		maxZoom: 19,
		opacity: 0.7,
		attribution: 'Dane mapy <a href="http://osm.org">OpenStreetmap<a/>'})
	map.addLayer(osm)

	const sensors = L.sensorLayer({showDeviceData: showDeviceData})

	map.addLayer(sensors)
	map.fire('zoomend')
}
