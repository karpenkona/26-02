const Messege = require('../model/messege.js');
const Users = require('../model/user.js');
const async = require("async");


exports.massage ={
	save (mess)  {
		var newMess = {
        text: mess.text,
        from: mess.user,
        to: mess.to,
        date: new Date,

	    };
	    return new Messege(newMess).save((err) => {
	    	if (err) {
	    		console.log('сработал контролер сообщений: не сохранили' + err);
	    	}
	    })


	},
	chat (req, res) {
		let id;
		if(req.user) {
			id = req.user.name;

		} else {
			res.render('chat', {err: 'Нужна авторизация'})
		}
		async.series([
			function(callback) {
				Messege.
				find({$or:[{to: id}, {from: id}]}, (err, data) => {
					if (err) {
						console.log('сработал контролер сообщений: поиск не удался' + err);
						callback(err)
					}
			
					else {
						console.log('сработал контролер сообщений: поиск удался' + data);
						callback(null, data) }
				});
    		},
    		function(callback) {
    			Users.
				find({}, {name: 1, _id: -1}, (err, users) => {
					if (err) {
						console.log('сработал контролер сообщений: поиск не удался' + err);
						callback(err)
					}
					else {
						callback(null, users)
					}
				})
    		}
    	],
		function(err, results) {
			if (err) {
				res.render('chat', {err: err})
			}
    		else {
    			let mess=results[0];
    			let user=results[1];
    			console.log('сообщения: ' + mess+ 'юзері' + user);
    			res.render('chat', {data: mess, users: user})
    		}
		});
	},
	getAllUser(req, res) {
		let id;
		if(req.user) {
			id = req.user._id;

		} else {
			id = 'anonim'
		}
		console.log('сработал контролер ID: ' + id);
		
		Messege.
		find({$or:[{to: id}, {from: id}]}, (err, data) => {
			if (err) {
				console.log('сработал контролер сообщений: поиск не удался' + err);
				res.render('chat', {err: err})
			}
			if (!data) {
				console.log('сработал контролер сообщений: не найдено у пользователя');
				res.render('chat', {data: 'не найдено'})
			}
			else {
				console.log('сработал контролер сообщений: сообщения найдены');
				Users.
				find({}, {name: 1, _id: -1}, (err, users) => {
					if (err) {
						console.log('сработал контролер сообщений: поиск не удался' + err);
						res.render('chat', {err: err})
					}
					if (!users) {
						console.log('сработал контролер сообщений: не найдено участников');
						res.render('chat', {data: 'не найдено'})
					}
					console.log('сработал контролер юзеров: ' + users);
					console.log('сработал контролер сообщений: ' + data);
					res.render('chat', {data: data, users: users})
				})

				
			}
		});
	},
	console (mess)  {
		console.log('сработал контролер сообщений: ' + mess);
	}

}