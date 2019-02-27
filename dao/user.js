var config      = require('../config/config');
var mongoose = require('mongoose');
var crypto = require('crypto');
var User = require('../model/user.js');
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
