var db = require('../config');
var crypto = require('crypto');
var mongoose = require('mongoose');

// See user.js for Schema descriptions of functionality

var Schema = mongoose.Schema;
var urlSchema = new Schema({
  url: String,
  base_url: String,
  code: String,
  title: String,
  visits: {type: Number, default: 0},
  createdAt: {type: Date, default: Date.now}
});

urlSchema.statics.shortenUrl = function(url, object){
      var shasum = crypto.createHash('sha1');
      shasum.update(url);
      object.code = shasum.digest('hex').slice(0,5)
      // object.update({'code': {}}, shasum.digest('hex').slice(0, 5));
};

urlSchema.pre('save', function(next){
  Link.shortenUrl(this.url, this);
  next();
})
var Link = mongoose.model('Link', urlSchema);

module.exports = Link;
