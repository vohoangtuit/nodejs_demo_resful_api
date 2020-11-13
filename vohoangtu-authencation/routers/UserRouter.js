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

// CREATES A NEW USER
router.post('/create', function (req, res) {
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var avatar = req.body.avatar;
  //var user = new User(name ,  email,  password);
  User.findOne({ email: email }, function (err, user) {
    if (user) {
      res.json({ "status": 402, "message": " Email " + email + " is Exist" });
    } else {
      User.create({
        name,
        email,
        password,
        avatar
      },
        function (err, users) {
          if (err) {
            res.status(500).json({
              "status": 500,
              'message': ' Create Account Fail!'

            });
          } else {

            res.status(200).json({
              "status": 200,
              'message': 'Create User Successfully!',
              users
            });
          }
        });
    }
    if (err) {
      res.json({ "status": 500, "message": "Error on the server" });
    }
  });

});
// GETS LIST USER FROM THE DATABASE
router.get('/getall', function (req, res) {

  User.find({}, function (err, user) {
    if (err) {
      res.json({
        "status": 500,
        'message': 'There was a problem finding the users!'
      });
    }
    else {

      res.json({
        "status": 200,
        'message': 'Get User Successfully!',
        user
      });
    }


  });

});
// GETS A SINGLE USER FROM THE DATABASE
router.get('/detail/:id', function (req, res) {
  User.findById(req.params.id, function (err, user) {
    if (err) {
      //    return res.status(500).send("There was a problem finding the user.")
      res.json({
        "status": 500,
        'message': 'There was a problem finding the user!'

      });
    }
    else if (!user) {
      //  return res.status(404).send("No user found.")
      res.json({
        "status": 404,
        'message': 'No user found.!'

      });
    } else {
      //  res.status(200).send(user);
      res.json({
        "status": 200,
        'message': 'Get detail User Successfully!',
        user
      });
    }

  });

});
// DELETES A USER FROM THE DATABASE
router.delete('/delete/:id', function (req, res) {
  var _id = req.params.id;
  User.findByIdAndRemove({ _id: _id }, function (err, user) {
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
  User.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true }, function (err, user) {
    if (err) {
      res.json({ "status": 500, "message": "There was a problem updating the user." });
    } else {
      res.json({ "status": 200, "message": "Successfully", user });
    }

  });

});
// USER LOGIN
router.post('/login', function (req, res) {
  let data = {
    email: req.body.email,
    password: req.body.password
  };
  console.log('welcome ' + req.body.email)
  if (!req.body.email) {
    console.log('email null ')
  }

  User.findOne(data).lean().exec(function (err, user) {
    if (err) {
      return res.json({ "status": 400, "message": "Error on the Server" });
    }
    if (!user) {
      return res.json({ "status": 404, 'message': 'User not found!' });
    }
    let token = jwt.sign({ user }, config.secret); // add token

    res.json({ "status": 200, 'message': 'Login Successfully', token: token, user });

  })

});
// USER GET SELF
router.get('/me', function (req, res) {
  var token = req.headers['token'];
  if (!token) return res.json({ "status": 401, "message": 'No token provided.' });
  jwt.verify(token, config.secret, function (err, profile) {
    if (err) return res.json({ "status": 500, "message": 'Failed to authenticate token.' });
    res.json({ "status": 200, "message": " Authenticate Successfully", user: profile.user ? profile.user : null });
  });
});

// UPLOAD FILE
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.jpg')
  }
});
var upload = multer({ storage: storage }).single('avatar');
router.post('/upload', function (req, res) {
  //var post_data = req.body;
  upload(req, res, function (err) {

    if (err) {
      // An error occurred when uploading
      res.json({
        status: 400,
        message: 'upload image fail'
      });
    } else {
      User.findByIdAndUpdate({ _id: '59aeb1d27a28dc1b88fe959f' }, req.body, { new: true }, function (err, user) {
        // if (err) {
        //   res.json({ "status": 500, "message": "There was a problem updating the user." });
        // } else {
        //   res.json({ "status": 200, "message": "Successfully", user });
        // }

        var newImg = fs.readFileSync(req.file.path);
        // encode the file as a base64 string.
        var encImg = newImg.toString('base64');

      });
    }
    //  res.json({
    //      status: 200,
    //      message: 'Image uploaded!'
    //  });

    // Everything went fine
  })

});
app.use('/upload', express.static('upload'));
router.get('/images/:id', function (req, res) {
  // var _id = req.params.id;
  // User.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true }, function (err, user) {
  //   if (err) {
  //     res.json({ "status": 500, "message": "There was a problem updating the user." });
  //   } else {
  //     res.json({ "status": 200, "message": "Successfully", user });
  //   }

  // });

});
module.exports = router;

// https://hackernoon.com/restful-api-design-with-node-js-26ccf66eab09
// https://www.youtube.com/watch?v=qlpSzsSamlU