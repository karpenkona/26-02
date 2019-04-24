const express = require('express');
var app = require('express')();
const session = require('express-session');
const path = require('path');
const favicon = require('serve-favicon');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;
const MongoStore = require('connect-mongo')(session);
const routes = require('./rout');

var http = require('http').Server(app);
var io = require('socket.io')(http);
require('./soket/index.js')(io);
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

/*io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    //io.emit('chat message', 'hi');
    socket.emit('hello', 'hello');
    socket.broadcast.emit('newUser', 'hello friends!');
  });
});*/


http.listen(8085, function(){
  console.log('listening on *: 8085');
});

//app.listen(process.env.port || config.port);