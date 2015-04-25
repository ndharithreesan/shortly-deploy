var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');
var Users = require('../app/collections/users');
var Links = require('../app/collections/links');

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

exports.fetchLinks = function(req, res) {
  Link.find(function(err, links){
    if(err){
      console.log('Error fetching Links', err);
      res.send(404);
    } else {
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

    Link.findOne({ url: uri }, function(err, found) {
    if (found) {
      res.send(200, found);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }

        var link = new Link({
          url: uri,
          title: title,
          base_url: req.headers.origin
        });

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
      User.comparePassword(password, found, function(match){
        if(match){

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
      found.visits ++;
      found.save();
      res.redirect (found.url);
    } else {
      res.redirect ('/');
    }
  });
};
