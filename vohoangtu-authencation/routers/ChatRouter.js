var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

//
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var app = express();

var fs = require('fs');
var im = require('imagemagick');
app.use(bodyParser.urlencoded({ extended: true }));

//var bcrypt = require('bcrypt');

router.use(bodyParser.urlencoded({ extended: true }));
var User = require('../models/User');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

// GETS LIST USER FROM THE DATABASE
router.get('/chat', function (req, res) {
  // khởi tạo kết nối socket 
  io.on('connection', function (socket) {
    socket.on('new_message', function (data) {
      console.log('data ' + data);
      socket.broadcast.emit('new_message', {
        username: socket.username,
        message: data

      });
    });

    socket.on('add_user', function (username) {
      console.log('add_user :' + username);
      socket.username = username;
      //});
      // when the client emits 'typing', we broadcast it to others
      socket.on('typing', function () {
        console.log('typing :' + socket.username);
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
});

module.exports = router;

// https://hackernoon.com/restful-api-design-with-node-js-26ccf66eab09
// https://www.youtube.com/watch?v=qlpSzsSamlU