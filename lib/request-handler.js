var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
};

//Changed generic fetch to generic find of data in Link dataset
exports.fetchLinks = function(req, res) {
  Link.find(function(err, links){
    if(err){
      console.log('Error fetching Links', err);
      res.send(404);
    } else {
      //send entire retrieved object instead of a models property
      res.send(200, links);
    }
  });
};


exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }
    // Use findOne to check for duplicates
    Link.findOne({ url: uri }, function(err, found) {
    if (found) {
      res.send(200, found);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }
        //Generate new link
        var link = new Link({
          url: uri,
          title: title,
          base_url: req.headers.origin
        });
        //MongoDB requires save to be called to add data
        link.save(function(error){
          console.log(error)
          res.send(200, link);
        });
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  User.findOne({username:username}, function(err, found){
    if (err){
      console.log('Badtimes', err);
    } else if (!found){
      res.redirect('/login');
    } else {
      //comparePassword is a method on the Model, not a model instance
      User.comparePassword(password, found, function(match){
        if(match){
          //createSession has implicit redirect
          util.createSession(req, res, found);
        } else {
          res.redirect('/login');
        }
      });
    }
  });

};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({username: username}, function(err, found){
    if(found){
      console.log('Account already exists');
      res.redirect('/signup');
    } else {
      var user = new User(
      {
        'username': username,
        'password': password
      });
      user.save(function(err){
        if (err){
          console.log(err);
          res.send(404);
        } else {
          util.createSession(req, res, user);
        }
      })
    }
  });

};

exports.navToLink = function(req, res) {
  Link.findOne({code: req.params[0]}, function(err, found){
    if (found){
      //Directly modifying property before a save
      //Possibly investigate update methods
      found.visits ++;
      found.save();
      res.redirect (found.url);
    } else {
      res.redirect ('/');
    }
  });
};
