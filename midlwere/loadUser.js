var daoUser=require('../dao/user');
var cookie = require('cookie');

module.exports=function (req, res, next) {
    if (!req.session.userid) {

        return next();
    }
    daoUser.findById(req.session.userid).then(function (user) {
        req.user=res.locals.user=user;

        res.setHeader('Set-Cookie', cookie.serialize('Username', String(user.name), {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7 // 1 week
    }))

        return next();

    })
}