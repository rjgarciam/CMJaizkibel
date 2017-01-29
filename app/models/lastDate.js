var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


// Books schema 
var LastDateSchema   = new Schema({
  date: {type: Date},
});

module.exports = mongoose.model('lastDate', LastDateSchema);