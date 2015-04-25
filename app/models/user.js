var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird')


var Schema = mongoose.Schema
var userSchema = new Schema({
  username: {type: String, unique: true},
  password: String,
  createdAt: {type: Date, default: Date.now}
});


userSchema.statics.comparePassword = function(attemptedPassword, user, callback) {
  bcrypt.compare(attemptedPassword, user['password'], function(err, isMatch) {
    callback(isMatch);
  });
};

userSchema.statics.hashPassword = function(obj, callback){
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(obj['password'], null, null)
    .then(function(hash) {
      obj['password'] = hash;
      callback();
    });
};

userSchema.pre('save', function(next){
  User.hashPassword(this, function(){
    next()
  });
});

var User = mongoose.model('User', userSchema);

module.exports= User;
