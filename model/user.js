var mongoose = require('mongoose');
//var Promo = require('/promo.js');

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

    },
    promocodes: [{
        code: {
          type: mongoose.Schema.ObjectId,
          ref: 'Promocode',
      },

      expires: Date,
      activate: Date,
  }],
})

module.exports = mongoose.model('user', user);