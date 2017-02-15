let minimap
let marker

class DevicePopup {
	constructor() {
			minimap = L.map('minimap').setView([51.1098, 17.0351], 13)
			const osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
			const osm = new L.TileLayer(osmUrl, {
				maxZoom: 19,
				opacity: 0.7,
				attribution: 'Dane mapy <a href="http://osm.org">OpenStreetmap<a/>'})
			minimap.addLayer(osm)
			marker = L.marker([0, 0]).addTo(minimap)
	}

	open(device) {
		if (device.readonly == false) {
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
		$('#devicePopup').popup('open')
		minimap.invalidateSize()
		minimap.setView(device.loc, 10)
		marker.setLatLng(device.loc)
	}

	close() {
		$('#devicePopup').popup('close')
	}
}

let popupDevice = new DevicePopup()
