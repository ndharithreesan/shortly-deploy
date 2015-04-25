
var mongoose = require('mongoose');
require('./models/user');

var mongoURI = process.env.CUSTOMCONNSTR_MONGOLAB_URI || 'mongodb://localhost/shortly';
mongoose.connect(mongoURI)
var db = mongoose.connection;

db.on('error', function(err){
  console.log(err);
});

module.exports =db;
