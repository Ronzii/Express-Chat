 exports.login = function(req, res){
 	var data = {
 		username : req.body.username,
 		password : req.body.password
 	};
 	user.login(data);
 	// Set Session Data
 	res.send('ok');
 };