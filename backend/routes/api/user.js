import express from 'express'
import {User} from './models'

export default () => {
	const router = express.Router()
	router.get('/', (req, res) => {
		User.find((err, user) => {
			if (err) {
				res.send(err)
			} else {
				res.json(user)
			}
		})
	})

	router.post('/', (req, res) => {
		let user = new User()
		user.name = req.body.name
		user.password = req.body.password
		user.save((err) => {
			if (err) {
				res.send(err)
			} else {
				res.json(user)
			}
		})
	})
	return router
}
