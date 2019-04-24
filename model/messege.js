var mongoose = require('mongoose');

var messenge = new mongoose.Schema({
	text : String,
	to: String,
	from: String,
	date: {
        type: Date
    },
});

module.exports = mongoose.model('messenge', messenge);