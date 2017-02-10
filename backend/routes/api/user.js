import express from 'express'
import {User} from './models'
import bcrypt from 'bcrypt'

export default ({config}) => {
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
		user.password = bcrypt.hashSync(req.body.password, config.salt)
		user.save((err) => {
			if (err) {
				res.send(err)
			} else {
				res.json({status: 'OK'})
			}
		})
	})
	return router
}
