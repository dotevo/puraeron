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
	return router
}
