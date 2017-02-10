import mongoose from 'mongoose'

export const User = mongoose.model('User', new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true,
		select: false
	}
}))

export const Device = mongoose.model('Device', new mongoose.Schema({
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	name: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true,
		select: false
	},
	loc: {
		type: [Number],
		index: '2d'
	}
}))

export const Measurement = mongoose.model('Measurement', new mongoose.Schema({
	values: {
		type: mongoose.Schema.Types.Mixed,
		required: true
	},
	device: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Device',
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	},
	loc: {
		type: [Number],
		index: '2d',
		required: true
	}
}))
