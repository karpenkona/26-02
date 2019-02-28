const express = require('express');
const session = require('express-session');
const path = require('path');
const favicon = require('serve-favicon');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;
const MongoStore = require('connect-mongo')(session);
const routes = require('./rout');
const app = express();
const config = require('./config/config');

app.set('views', './views');
app.set('view engine', 'pug');
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')))
app.use(express.static('./upload'));
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: false, uploadDir: './upload' }));
app.use(cookieParser());
app.use( session({
        secret : 's3Cur3',
        name : 'sessionId',
        cookie: { maxAge: 6000000}
    })
);
app.use(require('./midlwere/loadUser'));
routes(app);
app.listen(process.env.port || config.port);