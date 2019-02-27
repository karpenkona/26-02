var  daoMarket=require('../dao/market');

module.exports = app => {
    app.get('/', (req, res) => {
        daoMarket.getAll().then(function (markets) {

            if (markets.length == 0) res.render('index')
            else res.render('index', {'markets':markets});
        }), function () {
            res.render('error', {message: 'Что то пошло не так'});
        }


    });


};