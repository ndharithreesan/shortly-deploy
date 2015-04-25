var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird')


var Schema = mongoose.Schema
var userSchema = new Schema({
  name: String,
  password: String,
  createdAt: {type: Date, default: Date.now}
});


userSchema.statics.comparePassword = function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
    callback(isMatch);
  });
};

userSchema.statics.hashPassword = function(){
  // var cipher = Promise.promisify(bcrypt.hash);
  // return cipher(this.get('password'), null, null).bind(this)
  //   .then(function(hash) {
  //     this.set('password', hash);
  //   });
};

userSchema.on('init', function(model){
  model.hashPassword();
});

var User = mongoose.model('User', userSchema);

module.exports= User;
