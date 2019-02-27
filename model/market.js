var mongoose = require('mongoose');


var market = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },

    description : {
        type: String,
        required: true
    },
    img : {
        type: String,
        required: true
    },
    owner : {
        type: String,
        required: true
    },
    create : {
        type: Date,
        required: true
    },
    active : {
        //type: Float,
        type: Boolean

    },
    comments: []
})

module.exports = mongoose.model('market', market);
