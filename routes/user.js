var UserModel = require('../models/user_model').UserModel;
var OnlineUserModel = require('../models/user_model').OnlineUserModel;

exports.index = function(req, res){
	if(!req.session.username){
		var data = {
			username : req.body.username,
			password : req.body.password
		};
		var returnStream = function(data){
			req.session.username = req.body.username;
			console.log(req.session.username);
			res.end(JSON.stringify(data));
		};
		exports.login(data,returnStream);
	}
};

exports.login = function(data, callback){
	UserModel.findOne({
		username: data.username
	}, function(err, res){
		if(err){
			return console.dir('User Find Query Failed');
		}
		if(!res){
			console.log('User doesnot exist');
			callback(null);
		}
		else{
			var user = res._id;
			callback(user);
		}
	});
};
exports.goOnline = function(io, socket, data){
	console.log('User already exists');
	OnlineUserModel.findOne({
		username : data.username
	}, function(err, res){
		if(err){
			return console.dir('Problem Querying Online Users');
		}
		if(res){
			exports.updateSocketID(res.__id, io, socket, data);
		}
		else{
			// Create User
			exports.createOnlineUser(io,socket,data);
		}
	});
};
// TODO 'data' is defined but never used.
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
};
exports.register = function(io, socket, data){
	UserModel.findOne({
		username : data.username
	}, function(err, res){
		if(err){
			return console.dir('User Find Query Failed');
		}
		if(!res){
			exports.createUser(data);
		}
	});
};
exports.createUser = function(data){
	var new_user = new UserModel({
		username : data.username,
		password : data.password
	});
	new_user.save();
};
exports.createOnlineUser = function(io, socket, data){
	var new_user = new OnlineUserModel();
	new_user.username = data.username;
	new_user.socket_id = socket.id;
	new_user.save(function(err){
		if(err){
			return console.dir(err);
		}
		else{
			exports.getOnlineUsers(io,socket);
		}
	});
};
// TODO 'socket' is defined but never used.
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
};
exports.logout = function(io, socket, data){
	exports.disconnect(io,socket,data);
};
// TODO 'data' is defined but never used.
exports.disconnect = function(io, socket, data){
	OnlineUserModel.findOne({
		socket_id : socket.id
	}, function(err, res){
		if (err) {
			return console.dir('Query Socket Failed');
		}
		if(res){
			console.log('User Socket Found');
			res.remove();
			exports.getOnlineUsers(io,socket);
		}
	});
};	