import express from 'express'
import User from './user'
import Measurement from './measurement'
import Device from './device'

export default ({app}) => {
	const router = express.Router()

	router.get('/', (req, res) => {
		res.send('TODO')
	})
	router.use('/user', User({app}))
	router.use('/measurement', Measurement({app}))
	router.use('/device', Device({app}))
	return router
}
