var UserModel = require('../models/user_model').UserModel;

exports.login = function(io, socket, data){
	UserModel.findOne({
		username: data.username
	}, function(err, res){
		if(err || !data.username){
			return console.dir('User Query Failed');
		}
		if(res){
			// Update Socket ID for old user
			console.log('User already exists');
			UserModel.update({__id: res.__id}, { socket_id : socket.id}, function(err, res){
				if(err){
					return console.dir('Update User Socket Failed');
				}
				if(res){
					console.log('User Socket ID updated');
				}
				exports.onlineUsers(io,socket);
			});
		}
		else{
			// Create User
			exports.create(io, socket, data);
		}

	});
};
exports.onlineUsers = function(io, socket){
	var online = UserModel.find('');
	online.select('username');
	online.exec(function(err, res){
		if (err) {
			return console.dir('Online User List Query Failed');
		}
		//console.log('Online Users : ', res);
		io.sockets.emit('userlist', res);
	});
}
exports.create = function(io, socket, data){
	var new_user = new UserModel();
	new_user.username = data.username;
	new_user.socket_id = socket.id;
	new_user.save(function(err){
		if(!err){
			exports.onlineUsers(io,socket);
		}
	});
}

exports.disconnect = function(io, socket, data){
	UserModel.findOne({
		socket_id : socket.id
	}, function(err, res){
		if (err) {
			return console.dir('Query Socket Failed');
		}
		//console.log(res);
		if(res){
			console.log('User Socket Found');
			res.remove();
			exports.onlineUsers(io,socket);
		}
		else{
			console.log('Ghost Socket');
		}
	});
	
}