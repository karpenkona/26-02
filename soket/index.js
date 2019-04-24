const {chat} = require('../controler/index.js');
var cookie = require('cookie');

module.exports = io => {
	var people={};


	io.sockets.on('connection', function (socket) {
		let a = socket.request.headers.cookie;
		console.log('io: ' + cookie.parse(a).io);
		console.log('sessionId=: ' + cookie.parse(a).sessionId);
		console.log('userName=: ' + cookie.parse(a).Username);
		if (cookie.parse(a).Username) {
			console.log('userName=: ' + cookie.parse(a).Username);
			Username = cookie.parse(a).Username;
			socket.on('join', function (data) {
				socket.join(Username);
				people[Username] =  Username;
			});
		}
		else {
			socket.on('join', function (data) {
			socket.join(data.uid);
			people[data.uid] =  data.uid;
			socket.emit('getPeople', {people: people});
		});
		}
		
		socket.on('chat message', function(msg){
			chat.massage.console(msg.text);
			chat.massage.save(msg);
    		console.log('message: ' + msg.text);
    		console.log('user: ' + msg.user+ ' cookie.parse(a).Username: '+cookie.parse(a).Username);
    		if (!msg.to) {
    			socket.broadcast.emit('chat message', {text: msg.text, user: msg.user});
    		}
    		else {
    			io.to(msg.to).emit('chat message', {user: people[cookie.parse(a).Username] || msg.user, text: msg.text});
    		}
    	});
    	
	});
}
