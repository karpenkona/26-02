const mongoose = require('mongoose');
//const Float = require('mongoose-float').loadType(mongoose);

//const Notification = require('./notification');

const Promocode = new mongoose.Schema({
	code: {
		type: String,
		required: true,
	},
	activated: {
		type: Number,
		required: true,
	},
	isActive: {
		type: Boolean,
		required: true,
	},
	description: {
		type: String,
		required: true,
	}
}, { versionKey: false });
module.exports = mongoose.model('Promocode', Promocode);