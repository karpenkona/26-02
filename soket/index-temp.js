module.exports = io => {
	const users = {};
	io.on('connection', function(socket){
		console.log(' connect NEW user ');
		// socket.join(data.uid);
		socket.broadcast.emit('newUser', 'hello friends!');
		
		socket.on('chat message', function(msg){
			//let mess= JSON.parse(msg)
    		console.log('message: ' + msg.text);
    		console.log('user: ' + msg.user);
    		if (!msg.to) {
    			socket.broadcast.emit('chat message', {text: msg.text, user: msg.user});
    		}
    		else {
    			io.to(msg.to).emit('chat message', {user: msg.user, text: msg.text});
    		}
    		//socket.broadcast.emit('chat message', {text: msg.text, user: msg.user});
    		//socket.emit('hello', 'hello');
    	});
        
    	socket.on('join', function (data) {
    		socket.join(data.uid);
    		console.log('пользователь подключился к комнате: ' + data.uid);
    		users[data.uid]=data.uid;
    		console.log(' join connect NEW user ' + JSON.stringify(users));
    		//io.to(data.uid).emit('chat message2', {users: users, text: 'вы получили список участников'});
    		//io.in(data.uid).emit('chat message2', {users: users, text: 'вы получили список участников'});

    		socket.to(data.uid).emit('chat message2', {users: users, text: 'вы получили список участников'});
    		
  		});
  		//socket.in('user1@').emit('new_msg', {msg: 'hello'});
  	});
};
