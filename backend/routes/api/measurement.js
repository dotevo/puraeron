import express from 'express'
import {Measurement, Device} from './models'

export default () => {
	const router = express.Router()

	router.get('/', (req, res) => {
		Measurement.find((err, data) => {
			if (err) {
				res.send(err)
			} else {
				res.json(data)
			}
		})
	})

	router.get('/bbox/:bl/:ur/:h', (req, res) => {
		const bl = req.params.bl.split(',')
		const ur = req.params.ur.split(',')
		Measurement.find({
			date: {
				$gt: new Date(Date.now() - req.params.h * 60 * 60 * 1000)
			},
			loc: {
				$geoWithin: {
					$box:  [
						bl,
						ur
					]
				}
			}
		}, (err, measurement) => {
			if (err) {
				res.send(err)
			} else {
				res.json(measurement)
			}
		})
	})

	router.get('/device/:id/:h', (req, res) => {
		Measurement.find({
			date: {
				$gt: new Date(Date.now() - req.params.h * 60 * 60 * 1000)
			},
			device: req.params.id
		}, (err, measurement) => {
			if (err) {
				res.send(err)
			} else {
				res.json(measurement)
			}
		})
	})

	router.get('/id/:id', (req, res) => {
		Measurement.findById(req.params.id, (err, measurement) => {
			if (err) {
				res.send(err)
			} else {
				res.json(measurement)
			}
		})
	})

	router.post('/', (req, res) => {
		Device.findOne({_id: req.body.device, password: req.body.password}, (err, device) => {
			if (device == null) {
				res.send({error: 'Device not found'})
			} else if (err) {
				res.send(err)
			} else {
				let measurement = new Measurement()
				measurement.date = req.body.date
				measurement.values = req.body.values
				measurement.device = req.body.device
				if (measurement.date == null) {
					measurement.date = new Date()
				}
				if (req.body.loc != null) {
					measurement.loc = req.body.loc
				} else {
					measurement.loc = device.loc
				}
				measurement.save((err) => {
					if (err) {
						res.send(err)
					} else {
						res.json(measurement)
					}
				})
			}
		})

	})

	//TODO: PUT, DELETE
	return router
}
