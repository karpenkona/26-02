var config = require('../config/config');
var mongoose = require('mongoose');
var crypto = require('crypto');
var Promo = require('../model/promocode.js');
var User = require('../model/user.js');

exports.create = function(Data){
    var promo = {
        code: Data.code,
        description: Data.description,
        activated: Data.activated,
        isActive: Data.isActive

    }
    return new Promo(promo).save()
};
exports.getAll=function () {
    return Promo
        .find({}).then(function (promo) {
            if (promo){
                return promo
            }
            else {
                return Promise.reject("Error wrong")
            }

        });


};


exports.addpromo=function (code, id) {
	return Promo
	.findOne({code:code}, function (err, promo) {

	}).then(function (promo) {
		console.log('ПРОМО : '+promo);
		if (promo){
			console.log(promo._id);

			User
			.findOne({_id:id}, function (err, user) {

			}).then(function (user) {
				if (user){
                //console.log('user: '+user);
                //myArray.findIndex(x => x.id === '45');
                console.log('индекс промокода найденог оу партнера - ' + user.promocodes.findIndex(x => x.code.equals(promo._id)));

                if (user.promocodes.findIndex(x => x.code.equals(promo._id)) >= 0){
                    return Promise.reject("Error wrong - такой промокод уже применен")

                }
                else {
                    user.promocodes.unshift({code: promo._id,
                    expires: new Date(new Date().getTime() + (new Date().getTimezoneOffset() * 60000)+700200000),
                    activate: new Date()});
                user.save();
                promo.activated = promo.activated+1;
                promo.save();
                return promo

                }
                
            }
            else {

            	return Promise.reject("Error wrong1")
            }

        });

			//return promo
		}
		else {
			return Promise.reject("Error wrong2")
		}

	})

};