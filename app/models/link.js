var db = require('../config');
var crypto = require('crypto');
var mongoose = require('mongoose');

// var Link = db.Model.extend({
//   tableName: 'urls',
//   hasTimestamps: true,
//   defaults: {
//     visits: 0
//   },
//   initialize: function(){
//     this.on('creating', function(model, attrs, options){
//       var shasum = crypto.createHash('sha1');
//       shasum.update(model.get('url'));
//       model.set('code', shasum.digest('hex').slice(0, 5));
//     });
//   }
// });

var Schema = mongoose.Schema;
var urlSchema = new Schema({
  url: String,
  base_url: String,
  code: String,
  title: String,
  visits: Number,
  createdAt: {type: Date, default: Date.now}
});

urlSchema.statics.shortenUrl = function(url, object){
      var shasum = crypto.createHash('sha1');
      shasum.update(url);
      object['code'] = shasum.digest('hex').slice(0,5)
      // object.update({'code': {}}, shasum.digest('hex').slice(0, 5));
};

urlSchema.pre('save', function(next){
  Link.shortenUrl(this.url, this);
  next();
})
var Link = mongoose.model('Link', urlSchema);

module.exports = Link;
