import express from 'express'
import Auth from './auth'
import User from './user'
import Measurement from './measurement'
import Device from './device'

export default ({app, config}) => {
	const router = express.Router()

	router.get('/', (req, res) => {
		res.send('TODO')
	})
	router.use('/auth', Auth({app, config}))
	router.use('/user', User({app, config}))
	router.use('/measurement', Measurement({app}))
	router.use('/device', Device({app}))
	return router
}
