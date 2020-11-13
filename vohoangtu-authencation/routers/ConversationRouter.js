var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var dateTime = require('node-datetime');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

//var bcrypt = require('bcrypt');

router.use(bodyParser.urlencoded({ extended: true }));
var Conversation = require('../models/Conversation');
// CREATES A NEW USER
router.post('/create', function (req, res) {
  var idUserSender = req.body.idUserSender;
  var idUserReceiver = req.body.idUserReceiver;
  var content = req.body.content;
  var dt = dateTime.create();
  var formatted = dt.format('Y-m-d H:M:S');
  //var user = new User(name ,  email,  password);
  
    Conversation.create({
      idUserSender,
      idUserReceiver,
      content,
      formatted
    //  formatted
    },
      function (err, conversation) {
        if (err) {
          res.status(500).json({
            "status": 400,
            'message': ' Create Account Fail!'
  
          });
        } else {
  
          res.status(200).json({
            "status": 200,
            'message': 'Create conversation Successfully!',
            conversation
          });
        }
      });
  
  });

  
  
// GETS LIST USER FROM THE DATABASE
router.get('/getall', function (req, res) {

    Conversation.find({}, function (err, conversation) {
    if (err) {
      res.json({
        "status": 500,
        'message': 'There was a problem finding the users!'
      });
    }
    else {

      res.json({
        "status": 200,
        'message': 'Get conversation Successfully!',
        conversation
      });
    }


  });

});
// GETS A SINGLE USER FROM THE DATABASE
router.get('/detail/:id', function (req, res) {
    Conversation.findById(req.params.id, function (err, conversation) {
    if (err) {
      //    return res.status(500).send("There was a problem finding the user.")
      res.json({
        "status": 500,
        'message': 'There was a problem finding the user!'

      });
    }
    else if (!conversation) {
      //  return res.status(404).send("No user found.")
      res.json({
        "status": 404,
        'message': 'No user found.!'

      });
    } else {
      //  res.status(200).send(user);
      res.json({
        "status": 200,
        'message': 'Get detail Conversation Successfully!',
        conversation
      });
    }

  });

});
// DELETES A USER FROM THE DATABASE
router.delete('/delete/:id', function (req, res) {
  var _id = req.params.id;
  Conversation.findByIdAndRemove({ _id: _id }, function (err, conversation) {
    // if (err) return res.status(500).send("There was a problem deleting the user.");
    // res.status(200).send("User "+ user.name +" was deleted.");
    if (err) {
      res.json({ "status": 500, "message": "There was a problem deleting the user." });
    } else {
      res.json({ "status": 200, "message": "Successfully" });
    }
  });

});
// UPDATES A SINGLE USER IN THE DATABASE
router.put('/update/:id', function (req, res) {
  var _id = req.params.id;
  Conversation.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true }, function (err, conversation) {
    if (err) {
      res.json({ "status": 500, "message": "There was a problem updating the user." });
    } else {
      res.json({ "status": 200, "message": "Successfully", conversation });
    }

  });

});

module.exports = router;

// https://hackernoon.com/restful-api-design-with-node-js-26ccf66eab09
// https://www.youtube.com/watch?v=qlpSzsSamlU