import express from 'express'
import path from 'path'
import api from './api'

export default ({env, app}) => {
	const routes = express.Router()
	routes.get('/', (req, res) => {
		res.sendFile(path.join(env.path, 'frontend/main.html'))
	})

	app.use('/api', api({app}))
	return routes
}
