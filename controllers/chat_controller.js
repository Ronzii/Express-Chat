var ChatModel = require('../models/chat_model').ChatModel;

exports.insert = function(data){
	var chat = new ChatModel({
		chat_room : 1,
		username : data.username,
		message : data.message,
		timestamp : new Date().getTime()
	});
	chat.save();
	console.log(chat);

}