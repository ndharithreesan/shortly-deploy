
var mongoose = require('mongoose');
require('./models/user');

var mongoURI = 'mongodb://MongoLab-7l:aqAlUM5jgiF.KqX8JBavwjJDuvWmP9YmuOifs_O3HBg-@ds034348.mongolab.com:34348/MongoLab-7l' || 'mongodb://localhost/shortly';
mongoose.connect(mongoURI)
var db = mongoose.connection;

db.on('error', function(err){
  console.log(err);
});

module.exports =db;
