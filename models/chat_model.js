var mongoose = require('mongoose');

exports.ChatRoomMessageSchema = new mongoose.Schema({
	_id : mongoose.Schema.ObjectId,
	chat_room : Number,
	username : String,
	message : String,
	timestamp : ''
});

exports.ChatRoomSchema = new mongoose.Schema({
	_id : mongoose.Schema.ObjectId,
	chat_room : Number,
	username : String
})

exports.ChatModel = mongoose.model('Chat',exports.ChatRoomMessageSchema);
exports.ChatRoomModel = mongoose.model('Chatroom', exports.ChatRoomSchema);