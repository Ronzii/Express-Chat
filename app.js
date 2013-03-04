
/**
 * Module dependencies.
 */

 var express = require('express')
 , http = require('http')
 , path = require('path')
 , io = require('socket.io')
 , mongoose = require('mongoose')
 , user = require('./controllers/user_controller')
 , chat = require('./controllers/chat_controller');

 var app = express();

 app.configure(function(){
 	app.set('port', process.env.PORT || 3000);
 	app.use(express.favicon());
 	app.use(express.logger('dev'));
 	app.use(express.bodyParser());
 	app.use(express.methodOverride());
 	app.use(express.static(path.join(__dirname, 'public')));
 });

 app.configure('development', function(){
  	app.use(express.errorHandler());
});

 var server = http.createServer(app)
 , io = io.listen(server);

 mongoose.connect('localhost','samplechat');

 server.listen(app.get('port'), function(){
 	console.log("Express server listening on port " + app.get('port'));
 });

 io.sockets.on('connection',function(socket){
 	socket.on('register', function(data){
 		user.register(io, socket, data);
 	})
 	socket.on('login', function(data){
 		user.login(io,socket,data);
 	});
 	socket.on('chat', function(data){
 		socket.broadcast.emit('chat',data);
 		chat.insert(data);
 	});
 	socket.on('disconnect', function(data){
 		user.disconnect(io, socket, data);
 	});
 });