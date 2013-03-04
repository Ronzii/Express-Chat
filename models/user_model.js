var mongoose = require('mongoose');

exports.OnlineUserSchema = new mongoose.Schema({
	_id : mongoose.Schema.ObjectId,
	socket_id : String,
	username : String  
});

exports.UserSchema = new mongoose.Schema({
	_id : mongoose.Schema.ObjectId,
	username : String,
	password : String
});

exports.OnlineUserModel = mongoose.model('OnlineUser', exports.OnlineUserSchema);
exports.UserModel = mongoose.model('User',exports.UserSchema);

