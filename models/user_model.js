var mongoose = require('mongoose');

exports.UserSchema = new mongoose.Schema({
	_id : mongoose.Schema.ObjectId,
	socket_id : String,
	username : String  
});

exports.UserModel = mongoose.model('User',exports.UserSchema);