var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var userRouter = require('./routers/UserRouter');

//var chatRouter = require('./routers/ChatRouter');

//------------

// var PORT = 3000;
// var HOST_NAME = 'localhost';
// var DATABASE_NAME = 'shoppingList';
//var PORT = 3000;
var HOST_NAME = 'dbuser:Vohoangtu1990@ds161443.mlab.com:61443';
var DATABASE_NAME = 'db_test_resfull';
mongoose.connect('mongodb://' + HOST_NAME + '/' + DATABASE_NAME);
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
// default run index.html on web browser
//app.use(express.static(__dirname + '/public'));
var apiUser ='/api/user';
//var apiChat ='/api/chat';
app.use(apiUser, userRouter);
//app.use(apiChat, chatRouter); 
app.use('/',function(req,res){
    res.send('Error 404: Request time out....');
  
  });
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

// khởi tạo kết nối socket 
io.on('connection', function (socket) {  
    socket.on('new_message', function (data) {
      console.log('data '+data);   
      socket.broadcast.emit('new_message', {
        username: socket.username,
        message: data     
        
      });
    });   
   
    socket.on('add_user', function (username) {      
      console.log('add_user :'+username);   
      socket.username = username;
    //});
    // when the client emits 'typing', we broadcast it to others
    socket.on('typing', function () {
        console.log('typing :'+socket.username);
      socket.broadcast.emit('typing', {
        username: socket.username
      });
    });
   
    // when the client emits 'stop typing', we broadcast it to others
    socket.on('stop_typing', function () {
      socket.broadcast.emit('stop_typing', {
        username: socket.username
      });
    });  

    // when the user disconnects.. perform this
  socket.on('disconnect', function () {  
      // echo globally that this client has left
      socket.broadcast.emit('user_left', {
        username: socket.username
       
      });
  
  });
    
  });
});

server.listen(port, function () {
    console.log('Server listening at port - %d', port);
  });


