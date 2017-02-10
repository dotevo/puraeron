import express from 'express'
import {Device} from './models'
import {auth} from './auth'

export default () => {
	const router = express.Router()

	router.get('/', (req, res) => {
		Device.find((err, data) => {
			if (err) {
				res.send(err)
			} else {
				res.json(data)
			}
		})
	})

	router.get('/my', (req, res) => {
		Device.find({ owner: req.session.user }, (err, device) => {
			if (err) {
				res.send(err)
			} else {
				res.json(device)
			}
		})
	})

	router.get('/id/:id', (req, res) => {
		Device.findById(req.params.id, (err, device) => {
			if (err) {
				res.send(err)
			} else {
				res.json(device)
			}
		})
	})

	router.post('/', auth,(req, res) => {
		let device = new Device()
		device.owner = req.session.user
		device.password = req.body.password
		device.loc = req.body.loc
		device.save((err) => {
			if (err) {
				res.send(err)
			} else {
				res.json(device)
			}
		})
	})

	//TODO: PUT, DELETE
	return router
}
