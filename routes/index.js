exports.index = function(req, res){
	//console.log(req.sessionId);
	var username = 'Guest';
	if(req.session.username){
		username = req.session.username
	}
	res.render('index',{
		title : 'Standalone Chat',
		username : username,
		session : req.session.username
	});
};