var daoUser=require('../dao/user');

module.exports=function (req, res, next) {
    if (!req.session.userid) {

        return next();
    }
    daoUser.findById(req.session.userid).then(function (user) {
        req.user=res.locals.user=user;

        return next();

    })
}