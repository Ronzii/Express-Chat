
/**
 * Module dependencies.
 */

 var express = require('express')
 , http = require('http')
 , path = require('path')
 , io = require('socket.io')
 , routes = require('./routes')
 , mongoose = require('mongoose')
 , connect = require('connect')
 , cookie = require('express/node_modules/cookie')
 , user = require('./controllers/user_controller')
 , chat = require('./controllers/chat_controller');

 var app = express();

 app.configure(function(){
 	app.set('port', process.env.PORT || 3000);
 	app.set('views', __dirname + '/views');
 	app.set('view engine', 'jade');
 	app.use(express.favicon());
 	app.use(express.logger('dev'));
 	app.use(express.bodyParser());
 	app.use(express.cookieParser());
 	app.use(express.session({secret : 'secret', key : 'express.sid'}));
 	app.use(express.methodOverride());
 	app.use(app.router);
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
 app.get('/', routes.index);

 io.sockets.on('connection',function(socket){
 	socket.on('register', function(data){
 		user.register(io, socket, data);
 	})
 	socket.on('login', function(data){
 		console.log(socket.handshake.sessionID);
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

// For chat authentication
 io.set('authorization', function (handshakeData, accept) {
 	console.log(handshakeData);
 	if (handshakeData.headers.cookie) {
 		handshakeData.cookie = cookie.parse(handshakeData.headers.cookie);
 		handshakeData.sessionID = connect.utils.parseSignedCookie(handshakeData.cookie['express.sid'], 'secret');
 		if (handshakeData.cookie['express.sid'] == handshakeData.sessionID) {
 			return accept('Cookie is invalid.', false);
 		}
 	} else {
 		return accept('No cookie transmitted.', false);
 	} 
 	accept(null, true);
 });