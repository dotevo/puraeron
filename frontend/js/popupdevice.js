let minimap
let marker
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

let initChart = true
function refreshChart() {
	if (!initChart) {
		return
	}
	initChart = false
	var ctx = document.getElementById("deviceChart").getContext("2d")
	new Chart(ctx).Line(data, {
		onAnimationComplete: function () {
			let sourceCanvas = this.chart.ctx.canvas
			let copyWidth = this.scale.xScalePaddingLeft - 5
			var copyHeight = this.scale.endPoint + 5
			var targetCtx = document.getElementById("deviceChartAxis").getContext("2d")
			targetCtx.canvas.width = copyWidth
			targetCtx.drawImage(sourceCanvas, 0, 0, copyWidth, copyHeight, 0, 0, copyWidth, copyHeight)
		}
	})
}

class DevicePopup {
	constructor() {
			minimap = L.map('minimap').setView([51.1098, 17.0351], 13)
			const osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
			const osm = new L.TileLayer(osmUrl, {
				maxZoom: 19,
				opacity: 0.7,
				attribution: 'Dane mapy <a href="http://osm.org">OpenStreetmap<a/>'})
			minimap.addLayer(osm)
			marker = L.marker([0, 0], {draggable:'true'}).addTo(minimap)
	}
	init() {
		$( "#deviceTabs" ).tabs({
			activate: function(event, ui) {
				$('#devicePopup').popup("reposition", {
					"positionTo": "window"})
				refreshChart()
				minimap.invalidateSize()
			}
		})
	}

	open(device) {
		console.log(device)
		if (device['editable']) {
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

popupDevice = new DevicePopup()
$(document).bind('pagecreate', function() {
	popupDevice.init()
})
