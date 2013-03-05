var ChatModel = require('../models/chat_model').ChatModel;

exports.index = function(req, res){
	var chat_with = req.params.username;
	console.log(chat_with);
};

exports.insert = function(data){
	var chat = new ChatModel({
		chat_room : 1,
		username : data.username,
		message : data.message,
		timestamp : new Date().getTime()
	});
	chat.save();
};

exports.historyByUsername = function(username){
	ChatModel.find({
		username : username
	}, function(err, res){
		if(err){
			return console.dir(err);
		}
		if(res){
			console.log(res);
		}
	});
};

exports.historyByChatRoom = function(chat_room){
	ChatModel.find({
		chat_room : chat_room 
	}, function(err,res){
		if(err){
			return console.dir(err);
		}
		if(res){
			console.log(res);
		}
	});
};