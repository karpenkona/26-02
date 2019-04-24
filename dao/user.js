var config      = require('../config/config');
var mongoose = require('mongoose');
var crypto = require('crypto');
var User = require('../model/user.js');
var Promo = require('../model/promocode.js');
mongoose.connect(config.mongoose.uri, function(err) {
    if (err) throw err;

});
exports.create = function(userData){
    var user = {
        name: userData.name,
        email:userData.email,
        password: hash(userData.password),
        contacts:{p:'444444444'}
    }
    return new User(user).save()
};
exports.check=function (logUser) {
    return User
        .findOne({email:logUser.email}, function (err, user) {

        }).then(function (user) {
            if (user){
                //console.log('user: '+user);
                return user
            }
            else {

                return Promise.reject("Error wrong")
            }

        });


}
exports.getAll=function () {
    return User
        .find({}, function (err, users) {
            // docs.forEach
        }).then(function (users) {
            if (users){
                return users
            }
            else {
                return Promise.reject("Error wrong")
            }

        });


}
/*exports.allUserPromocodes=function (id) {
    return User.
        findOne({_id:id},{_id: 0, promocodes: 1}).then(function (user) {
        if ( user ){
            //console.log("user add to session: "+user.username);
            //return Promise.resolve(user)
            return user;
        } else {
            return Promise.reject("Error wrong")
        }

    })

};*/

exports.findByIdPromocode=function (id) {
    return User
        .findOne({_id:id},{promocodes: 1}, function (err, market) {

        }).then(function (market) {
            if (market){
                return market
            }
            else {
                return Promise.reject("Error wrong")
            }

        })

};

exports.findUsersPromocode = (id, cb) => {
    User.
    findOne({_id: id}).
    populate('promocodes').
    
    exec(function (err, users) {
        if (err) cb(err, null);
        console.log('найдено - ', users);
        cb(null, users);
    });
};

exports.findUsersPromocode2 = (id) => {
    return User.
    findOne({_id: id}).
    populate('promocodes').
    
    exec(function (err, users) {
        if (err) cb(err, null);
        console.log('найдено - ', users);
        return users
    });
};
// рабочая
exports.findUsersPromocode3=function (id) {
    return User
        .findOne({_id:id},{promocodes: 1, }).populate('promocodes.code').then(function (promo) {
            if (promo){
                console.log('найдено - ', promo);
                return promo
            }
            else {
                return Promise.reject("Error wrong")
            }

        })

};
exports.addpromo=function (id) {
    return User
        .findOne({_id:id}, function (err, user) {

        }).then(function (user) {
            if (user){
                return user
            }
            else {
                return Promise.reject("Error wrong")
            }

        })

};

exports.findById=function (id) {
    return User.
        findOne({_id:id}).then(function (user) {
        if ( user ){
            //console.log("user add to session: "+user.username);
            return Promise.resolve(user)
        } else {
            return Promise.reject("Error wrong")
        }

    })

};
function hash(text) {
    return crypto.createHash('sha1')
        .update(text).digest('base64')
}
