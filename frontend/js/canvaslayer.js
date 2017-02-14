function hue2rgb(p, q, t) {
	if (t < 0) {
		t += 1
	}
	if (t > 1) {
		t -= 1
	}
	if (t < 1 / 6) {
		return p + (q - p) * 6 * t
	}
	if (t < 1 / 2) {
		return q
	}
	if (t < 2 / 3) {
		return p + (q - p) * (2 / 3 - t) * 6
	}
	return p
}

function hslToRgb(h, s, l) {
	var r, g, b

	if (s == 0) {
		r = g = b = l
	} else {
		var q = l < 0.5 ? l * (1 + s) : l + s - l * s
		var p = 2 * l - q
		r = hue2rgb(p, q, h + 1 / 3)
		g = hue2rgb(p, q, h)
		b = hue2rgb(p, q, h - 1 / 3)
	}
	return [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)]
}

function numberToColorHsl(i, distance) {
	if (distance > 0.5) {
		distance = 0.5
	} else if (distance < 0) {
		distance = 0
	}
	var hue = i * 1.2 / 3.6
	var rgb = hslToRgb(hue, 1, distance)
	return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')'
}
/*
function numberToColorRgb(i, distance) {
	var red = Math.floor(255 - (255 * i)) * distance
	var green = Math.floor(255 * i) * distance
	return 'rgb(' + red + ',' + green + ',0)'
}
*/

L.CanvasLayer = L.GridLayer.extend({
	initialize: function(opts) {
		L.GridLayer.prototype.initialize.call(this, opts)
		L.Util.setOptions(this, opts)
	},

	calculate: function(point, markers) {
		let distance = 0
		let value = 0
		let min = 1000000
		for (let key in markers) {
			const marker = markers[key]
			const valueTmp = this.options.getValue(marker)
			if (valueTmp == null) {
				continue;
			}
			const distanceTmp = point.distanceTo(marker.getLatLng())
			value += valueTmp / distanceTmp
			distance +=  1 / distanceTmp
			if (distanceTmp < min) {
				min = distanceTmp
			}
		}
		return {value: value / distance, mindistance: min}
	},

	createTile: function(coords) {
		let tile = L.DomUtil.create('canvas', 'leaflet-tile')
		let size = this.getTileSize()
		tile.width = size.x
		tile.height = size.y
		var ctx = tile.getContext('2d')

		const nwPoint = coords.scaleBy(size)
		const nw = map.unproject(nwPoint, coords.z)
		const nwPoint2 = coords.add([1,1]).scaleBy(size)
		const se = map.unproject(nwPoint2, coords.z)

		const TILE_SIZE = 16;

		const stepH = (se.lng - nw.lng) * TILE_SIZE / tile.width
		const stepV = (nw.lat - se.lat) * TILE_SIZE / tile.height
		for (var i = 0;i < tile.width / TILE_SIZE;i++) {
			for (var j = 0;j < tile.height / TILE_SIZE;j++) {
				const x = nw.lng + stepH * i
				const y = nw.lat - stepV * j
				const point = L.latLng(y,x)
				let markers = this.options.getMarkers(point)
				if (markers.length > 7) {
					console.log(markers.length)
				}
				if (markers.length == 0) {
					ctx.fillStyle = 'black'
					ctx.fillRect(i * TILE_SIZE, j * TILE_SIZE, TILE_SIZE, TILE_SIZE)
				} else {
					const a = this.calculate(point, markers)
					//console.log(a)
					let dis = 1 - a.mindistance / 50000
					//console.log(dis)
					if (dis < 0) {
						dis = 0
					}
					//ctx.fillStyle = numberToColorHsl(markers.length /5, dis)
					ctx.fillStyle = numberToColorHsl(a.value / 20, dis)

					ctx.fillRect(i * TILE_SIZE, j * TILE_SIZE, TILE_SIZE, TILE_SIZE)
				}
			}
		}
		return tile
	}
})

L.canvasLayer = function (opts) {
	return new L.CanvasLayer(opts)
}
