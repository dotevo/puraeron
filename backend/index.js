import http from 'http'
import express from 'express'
import path from 'path'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'

import routes from './routes'
import config from './config.json'

mongoose.connect(config.db, {server: {socketOptions: {keepAlive: 1}}})
mongoose.connection.on('error', () => {
	throw new Error(`unable to connect to database: ${config.db}`)
})

let env = {path: __dirname}

const app = express()
app.server = http.createServer(app)
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'frontend')))
app.use('/', routes({env, config, app}))
app.server.listen(process.env.PORT || config.port)

console.log(`Started on port ${app.server.address().port}`);
