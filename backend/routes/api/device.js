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
		Device.find({owner: req.session.user}, (err, devs) => {
			if (err) {
				res.send(err)
			} else {
				let devices = []
				//Może da się łatwiej :-/
				for (let k in devs) {
					let device = devs[k].toObject()
					device.editable = device.owner == req.session.userid
					devices.push(device)
				}
				res.json(devices)
			}
		})
	})

	router.put('/id/:id', auth,(req, res) => {
		Device.findById(req.params.id, (err, device) => {
			if (err) {
				res.send(err)
			} else {
				if (device.owner != req.session.userid) {
					res.sendStatus(403)
					return
				}
				if (req.body.password != null) {
					device.password = req.body.password
				}
				device.name = req.body.name
				device.loc = req.body.loc
				device.save()
				res.json(device)
			}
		})
	})

	router.get('/id/:id', (req, res) => {
		Device.findById(req.params.id, (err, dev) => {
			if (err) {
				res.send(err)
			} else {
				let device = dev.toObject()
				device.editable = device.owner == req.session.userid
				res.json(device)
			}
		})
	})

	router.post('/', auth,(req, res) => {
		let device = new Device()
		device.owner = req.session.user
		device.password = req.body.password
		device.name = req.body.name
		device.loc = req.body.loc
		device.save((err) => {
			if (err) {
				res.send(err)
			} else {
				res.json(device)
			}
		})
	})

	//TODO: DELETE
	return router
}
