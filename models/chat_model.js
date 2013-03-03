var mongoose = require('mongoose');

exports.MessageSchema = new mongoose.Schema({
	_id : mongoose.Schema.ObjectId,
	chat_room : Number,
	username : '',
	message : '',
	timestamp : ''
});

exports.ChatModel = mongoose.model('Chat',exports.MessageSchema);