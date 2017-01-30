import express from 'express'
import {Measurement} from './models'

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

	router.get('/:id', (req, res) => {
		Measurement.findById(req.params.id, (err, measurement) => {
			if (err) {
				res.send(err)
			} else {
				res.json(measurement)
			}
		})
	})

	router.post('/', (req, res) => {
		let measurement = new Measurement()
		measurement.date = req.body.date
		measurement.values = req.body.values
		measurement.device = req.body.device
		measurement.loc = req.body.loc
		measurement.save((err) => {
			if (err) {
				res.send(err)
			} else {
				res.json(measurement)
			}
		})
	})

	//TODO: PUT, DELETE
	return router
}
