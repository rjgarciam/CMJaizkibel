var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


// Books schema 
var BookSchema   = new Schema({
  numero: {type: Number},
  letra: {type: String},
  apellidos:   {type: String},
  nombre:   {type: String},
  titulo:   {type: String},
  idioma:   {type: String},
  lugar:   {type: String},
  enUso:   {type: Number},
  fecha: {type: Date},
  fullAuthor: {type: String},
});

module.exports = mongoose.model('book', BookSchema);