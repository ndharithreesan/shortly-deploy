
var mongoose = require('mongoose');
require('./models/user');
mongoose.connect('mongodb://localhost/shortly')
var db = mongoose.connection;

db.on('error', function(err){
  console.log(err);
});
