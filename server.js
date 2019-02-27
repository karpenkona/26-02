var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
const MongoStore = require('connect-mongo')(session);
//const MongoStore = require('connect-mongo')(express);
var daoUser=require('./dao/user');
var daoMarket=require('./dao/market');
var multer  = require('multer');
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

var app = express();
var config = require('./config/config');
var index=require('./rout/index');
//var login=require('./rout/login');
app.set('views', './views');
app.set('view engine', 'pug');
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')))
app.use(express.static('./upload'));
app.use(express.static('./public'));
//app.use(bodyParser({uploadDir: './upload'}));
app.use(bodyParser.urlencoded({ extended: false, uploadDir: './upload' }));



app.use(cookieParser());

app.use( session({
        secret : 's3Cur3',
        name : 'sessionId',
        cookie: { maxAge: 6000000}
    })
);
app.use(require('./midlwere/loadUser'));
const routes = require('./rout');
routes(app);
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
                        //console.log("user_id: "+user._id);
                        req.session.userid=user._id;
                        //console.log("in session add user_id: "+req.session.userid);
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
        //res.end('no')
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
app.get('/addmarket', control, function (req, res) {
    res.render('addmarket')
});
app.post('/addmarket', control, multer({
    storage: storage
}).single('image'), function (req, res) {
    console.log('post input');
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

app.listen(config.port);

function str2bool(strvalue){
    return (strvalue && typeof strvalue == 'string') ? (strvalue.toLowerCase() == 'true' || strvalue == '1') : (strvalue == true);
}
function control(req, res, next) {
    if (req.user) next();
    else {
        //console.log("loadUser - FALSE");
        res.redirect('/');
    }
}


