var UserModel = require('../models/user_model').UserModel;
var OnlineUserModel = require('../models/user_model').OnlineUserModel;

exports.login = function(io, socket, data){
	UserModel.findOne({
		username: data.username
	}, function(err, res){
		if(err){
			return console.dir('User Find Query Failed');
		}
		if(res){
			console.log('User already exists');
			OnlineUserModel.findOne({
				username : data.username
			}, function(err, res){
				if(err){
					return console.dir('Problem Querying Onlie Users');
				}
				if(res){
					exports.updateSocketID(res.__id, io, socket, data);
				}
				else{
					// Create User
					exports.createOnlineUser(io,socket,data);
				}
			})
			
		}
	})
}
exports.updateSocketID = function(id, io, socket, data){
	// Update Socket ID for already logged in user
	OnlineUserModel.update({__id: id}, { socket_id : socket.id}, function(err, res){
		if(err){
			return console.dir('Update User Socket Failed');
		}
		if(res){
			console.log('User Socket ID updated');
		}
	});
}
exports.register = function(io, socket, data){
	UserModel.findOne({
		username : data.username
	}, function(err, res){
		if(err){
			return console.dir('User Find Query Failed');
		}
		if(res){
		}
		else{
			exports.createUser(data);
		}
	});
}
exports.createUser = function(data){
	var new_user = new UserModel({
		username : data.username,
		password : data.password
	});
	new_user.save();
}
exports.createOnlineUser = function(io, socket, data){
	var new_user = new OnlineUserModel();
	new_user.username = data.username;
	new_user.socket_id = socket.id;
	new_user.save(function(err){
		if(err){
			console.log(err);
		}
		else{
			exports.getOnlineUsers(io,socket);
		}
	});
}
exports.getOnlineUsers = function(io, socket){
	var online = OnlineUserModel.find('');
	online.select('username');
	online.exec(function(err, res){
		if (err) {
			return console.dir('Online User List Query Failed');
		}
		//console.log('Online Users : ', res);
		io.sockets.emit('userlist', res);
	});
}

exports.disconnect = function(io, socket, data){
	OnlineUserModel.findOne({
		socket_id : socket.id
	}, function(err, res){
		if (err) {
			return console.dir('Query Socket Failed');
		}
		//console.log(res);
		if(res){
			console.log('User Socket Found');
			res.remove();
			exports.getOnlineUsers(io,socket);
		}
		else{
			console.log('Ghost Socket');
			// TODO remove Ghost Socket in OnlineUserModel
		}
	});
}