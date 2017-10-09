var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


// Books schema 
var BookSchema   = new Schema({
  titulo:   {type: String},
  enUso:   {type: Number},
  fullAuthor: {type: String},
  fecha: {type: Date},
});

module.exports = mongoose.model('book', BookSchema);