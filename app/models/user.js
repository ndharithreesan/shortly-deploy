var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird')


var Schema = mongoose.Schema
var userSchema = new Schema({
  //unique declaration prevents duplicate users on each password hashing
  username: {type: String, unique: true},
  password: String,
  createdAt: {type: Date, default: Date.now}
});

// Changes during MongoDB refactor, declared Schemas, attached
// static methods to them (could not use this keyword with static
// because the this referred to the model, an not instance of model)

userSchema.statics.comparePassword = function(attemptedPassword, user, callback) {
  bcrypt.compare(attemptedPassword, user.password, function(err, isMatch) {
    callback(isMatch);
  });
};

userSchema.statics.hashPassword = function(obj, callback){
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(obj.password, null, null)
    .then(function(hash) {
      obj.password = hash;
      callback();
    });
};

// Before each save (which should only happen once on registration, possibly
// add change password functionality later) the password is changed from
// plaintext to hashed form

userSchema.pre('save', function(next){
  User.hashPassword(this, function(){
    next()
  });
});

//instantiating a Model to use from the Schema

var User = mongoose.model('User', userSchema);

module.exports= User;
