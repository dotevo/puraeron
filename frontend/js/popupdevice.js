class DevicePopup {
	open(data) {
		$('#devicePopup').popup('open')
		minimap.invalidateSize()
		console.log(data)
		//data.loc[0] [1]
		//data.owner
		//data.name
	}

	close() {
		$('#devicePopup').popup('close')
	}
}

let popupDevice = new DevicePopup()
