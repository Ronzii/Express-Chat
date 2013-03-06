var socket;
$(document).ready(function(){

    // UI Logic
    function getContentById(id){
        var path = 'content/' + id + '/index.html';
        $.get(path, function(data){
            $('#mainBody').html(data);    
        });
    }
    $('.nav li a').click(function(){
        getContentById(this.id);
    });
    getContentById('login');

    $('#logout').click(function(){
        $.ajax({
            url : '/logout',
            success : function(){
                // TODO 'data' is not defined.
                $('#logoutContainer').hide();
                $('#onlineUsers').html('');
                socket.emit('logout');
            }
        });
    });

    // Chat Logic
    socket = io.connect('http://localhost:3000');
    socket.on('userlist', function(list){
        $('#onlineUsers').html('');
        for(var i=0;i<list.length;i++){
            $('#onlineUsers').append('<li><a href="#">' + list[i].username + '</a></li>');
        }
    });
});