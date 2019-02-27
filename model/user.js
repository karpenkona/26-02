var mongoose = require('mongoose');

var user = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },

    password : {
        type: String,
        required: true
    },
    contacts:{
        type: Object
    },
    role: {
        type: String,
        default: 'partner',
        required: true

    }
})

module.exports = mongoose.model('user', user);