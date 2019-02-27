var config = require('../config/config');
var mongoose = require('mongoose');
var crypto = require('crypto');
var Market = require('../model/market');

mongoose.connect(config.mongoose.uri, function(err) {
    if (err) throw err;
    //console.log('Successfully connected to MongoDB(daoSite)');
});

exports.create = function(Data){
    var market = {
        name: Data.name,
        description: Data.description,
        img: Data.img,
        owner: Data.owner,
        create: Data.createD

    }
    return new Market(market).save()
};
exports.getAll=function () {
    return Market
        .find({}, function (err, market) {

        }).then(function (market) {
            if (market){
                return market
            }
            else {
                return Promise.reject("Error wrong")
            }

        });


};
exports.comments=function (id, comment) {

    Market.findOneAndUpdate(
        { _id: id},
        { $push: { comments: comment} },
        function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log(success);
            }
        });

    
}


exports.findById=function (id) {
    return Market
        .findOne({_id:id}, function (err, market) {

        }).then(function (market) {
            if (market){
                return market
            }
            else {
                return Promise.reject("Error wrong")
            }

        })

}
exports.findSiteById=function (id) {
    return Market.findById(id, function(error, doc) {

    }).then(function (market) {
        if (market){
            return market
        }
        else {
            return Promise.reject("Error wrong")
        }

    }, function (reason) {
        return Promise.reject("Error wrong")
    })

};
