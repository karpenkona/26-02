var multer  = require('multer');
var path = require('path');
var daoUser=require('../dao/user');
var daoMarket=require('../dao/market');
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