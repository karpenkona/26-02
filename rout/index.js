var mongoose = require('mongoose');
var crypto = require('crypto');
var Promo = require('../model/promocode.js');
var Mess = require('../model/messege.js');
var User = require('../model/user.js');
var multer  = require('multer');
var path = require('path');
var daoUser=require('../dao/user');
var daoMarket=require('../dao/market');
var daoPromocode = require('../dao/promo.js');
var async = require("async");
const messenge = require('../controler/index.js');

const moment = require('moment');

var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './upload/img/')
    },
    filename: function(req, file, callback) {
        var a = file.originalname.split('.')[0];
        callback(null, a + '-' + Date.now() + path.extname(file.originalname))
    },
    limits: {
        fieldNameSize: 100,
        files: 4,
        fields: 10}
});

module.exports = app => {
    //app.get('/chat', messenge.chat.massage.getAllUser);
    app.get('/chat', messenge.chat.massage.chat);

    app.get('/mypromocodes', (req, res, next) =>{
        const id=req.user._id;
        User.
                findById(id, { promocodes: 1 }).populate('promocodes.code').exec((err, user) => {
                    if (err) {
                        console.log("ERROR - User", err);
                        return res.send(err);
                    }
                    const {promocodes}=user;
                    return res.render('mypromocode', {promo:promocodes})
                    });
    });
    // рабочий дубль
    app.get('/mp4', function (req, res) {
        var id=req.user._id;
        //var coment=req.params.comment;
        daoUser.findUsersPromocode3(id).then( function (results) {
                //res.send(results.promocodes)
                const {promocodes}=results;
                res.render('mypromocode', {promo:promocodes})

            }, function () {
                console.log("ERROR - mp3");
                res.render('index');
            })
            

    });



    app.get('/', (req, res) => {
        daoMarket.getAll().then(function (markets) {

            if (markets.length == 0) res.render('index')
            else res.render('index', {'markets':markets});
        }), function () {
            res.render('error', {message: 'Что то пошло не так'});
        }


    });

    app.get('/logout', function (req, res) {
        if (req.session) {
            req.session.destroy(function() {});
        }
        res.redirect('/login');
    })
    app.get('/login', function (req, res) {
        res.render('login', {message: 'Что то пошло не так'});


    });
    app.post('/login', multer({
        storage: storage
    }).single('image'), function (req, res) {
        if (req.body.email && req.body.password){
            var logUser={
                password: req.body.password,
                email: req.body.email
            }
            try {
                daoUser.check(logUser).then(function (user) {
                        if (user){
                            req.session.userid=user._id;
                            res.redirect('/');
                        }
                    }, function () {
                        res.redirect('/login');

                    }

                )

            }
            catch(e) {
                res.render('error', {error:e})
            }



        }
        else {
            res.redirect('/log');
        }

    })
    app.post('/register', multer({
        storage: storage
    }).single('image'), function (req, res) {
        console.log("post1");
        //console.log("Hrouter registrator, session id: "+req.sessionID);
        //console.log("name: "+req.body.name);
        if (req.body.name && req.body.email && req.body.password){
            var newUser={
                name: req.body.name,
                password: req.body.password,
                email: req.body.email

            }
            try {
                daoUser.create(newUser).then(function (user) {
                    req.session.userid=user._id;
                    console.log("post2");
                    res.redirect('/')
                });

            }
            catch(e) {
                res.render('error', {error:e})
            }


        }

    })
    app.use((err, req, res, next) => {
        console.log(err.stack)

        res.status(500).json({error: err.stack})
    });
    
    app.get('/mypromo', function (req, res) {
        var id=req.user._id;
        //var coment=req.params.comment;
        daoUser.findByIdPromocode(id)
            .then( function (results) {
                //res.send(results.promocodes)
                const {promocodes}=results;
                res.render('mypromocode', {promo:promocodes})

            }, function () {
                console.log("ERROR");
                res.render('index');
            })

    });
    app.get('/mp', function (req, res) {
        var id=req.user._id;
        //var coment=req.params.comment;
        daoUser.findUsersPromocode(id, function (err, results) {
            if (err) {
                res.send('error promocodes')
            }
                //res.send(results.promocodes)
                console.log('у пользователя -  -  '+results);
                console.log('промокодов- - -  '+results.promocodes.length+'промокоди - '+results.promocodes);
                const {promocodes}=results;
                res.send(promocodes)

            })
            

    });
    app.get('/mp2', function (req, res) {
        var id=req.user._id;
        //var coment=req.params.comment;
        daoUser.findUsersPromocode3(id, function (err, results) {
            if (err) {
                res.send('error promocodes')
            }
                //res.send(results.promocodes)
                console.log('у пользователя -  -  '+results);
                console.log('промокодов- - -  '+results.promocodes.length+'промокоди - '+results.promocodes);
                const {promocodes}=results;
                res.send(promocodes)

            })
            

    });
    // рабочий
    app.get('/mp3', function (req, res) {
        var id=req.user._id;
        //var coment=req.params.comment;
        daoUser.findUsersPromocode3(id).then( function (results) {
                //res.send(results.promocodes)
                const {promocodes}=results;
                res.render('mypromocode', {promo:promocodes})

            }, function () {
                console.log("ERROR - mp3");
                res.render('index');
            })
            

    });




    app.post('/addmypromo', multer({
        storage: storage
    }).single('image'), (req, res) =>{
        console.log('CODE (POST) -  -  '+req.body.code)
        daoPromocode.addpromo(req.body.code, req.user._id);
        res.send('ok');
    });
    app.post('/addmypromo2', control, multer({
        storage: storage
        }).single('image'), 
    (req, res) => {
        if (typeof req.body.code !='string' || req.body.code.length < 3 || req.body.code.length > 10 ) {
            return res.send('не корректно');
        }
        const id=req.user._id;
        async.series([
            (callback) => {
                Promo
                .findOne({ code: req.body.code }, (err, promo) => {
                    if(err) callback(err);
                    else callback(null, promo);        
                })
            
            },
            (callback) => {
            User.
                findById(id, { promocodes: 1 }, (err, user) => {
                    if(err) callback(err);
                    else callback(null, user);
                })
            },
        
        ],
        function(err, results) {
            if (results[1].promocodes.findIndex(x => x.code.equals(results[0]._id)) >= 0 || !results[0].isActive) {
                res.json({
                    success: false,
                    text: 'Такой промокод уже добавлен',
                });
            } else {
                results[1].promocodes.unshift({
                    code: results[0]._id,
                    expires: moment().day(31),
                    activate: new Date(),
                });

                results[1].save(err => {
                    if (err){
                      res.json({
                          success: false,
                          text: 'Не удалось сохранить промокод у пользователя',
                    });
                    }
                    

                });
                results[0].activated += 1;
                results[0].save(err => {
                    if (err) {
                        res.json({
                          success: false,
                          text: 'Не удалось сохранить промокод',
                      });

                    }
                    
                });
                res.json({
                    success: true,
                    promocod: results[1].promocodes[0],
                    description: results[0].description,
                });
            }   
        });
    });

    app.get('/allpromocode', (req, res) => {
        daoPromocode.getAll().then(function (promo) {

            if (promo.length == 0) res.render('index')
            else res.render('allpromocode', {'promo':promo});
        }), function () {
            res.render('error', {message: 'Что то пошло не так'});
        }


    });
    app.get('/addpromo', control, function (req, res) {
        res.render('addpromo')});

    

    app.post('/addpromo', control, multer({
        storage: storage
    }).single('image'), function (req, res) {
        console.log('----------------post PROMO input');
        var  promokode={
            code: req.body.code,
            description: req.body.description,
            activated: 0,
            isActive: true
        };
        daoPromocode.create(promokode).then(function (result) {
            res.end('ok')



        }, function(reason){
            res.redirect('/');
        })


    });

    app.get('/addmarket', control, function (req, res) {
        res.render('addmarket')
    });

    app.post('/addmarket', control, multer({
        storage: storage
    }).single('image'), function (req, res) {
        console.log('----------------post input');
        var  market={
            name: req.body.name,
            description: req.body.description,
            img: req.file.filename,
            owner: req.user._id,
            createD: Date.now(),
            active: publish=str2bool(req.body.active)
        };
        daoMarket.create(market).then(function (result) {
            res.end('ok')



        }, function(reason){
            res.redirect('/');
        })


    });
    app.get('/market/:id', function (req, res) {
        var id=req.params.id;
        //var coment=req.params.comment;
        daoMarket.findById(id)
            .then( function (results) {
                res.render('market', {market:results})

            }, function () {
                console.log("ERROR");
                res.render('index');
            })

    });
    app.post('/market/', control, function (req, res) {
        console.log('iiiddd= '+req.body.id + 'comment - '+req.body.comment);
        var comment={name: req.user.name, text: req.body.comment}

        daoMarket.comments(req.body.id, comment);
        res.end('ok')
    })


};
function str2bool(strvalue){
    return (strvalue && typeof strvalue == 'string') ? (strvalue.toLowerCase() == 'true' || strvalue == '1') : (strvalue == true);
}
function control(req, res, next) {
    if (req.user) next();
    else {
        res.redirect('/');
    }
}