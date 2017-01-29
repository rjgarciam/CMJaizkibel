var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


// Meal schema 
var SportsSchema   = new Schema({
  name:           {type: String},
  place:          {type: String},
  playersPerTeam: {type: Number},
  numberOfTeams:  {type: Number},
  date:           {type: Date},
  startTime:      {type: Date},
  endTime:        {type: Date},
  isLocked:       {type: Boolean},
  playersList:    [Schema.Types.Object],
  waitingList:    {type: Boolean},
});

module.exports = mongoose.model('Sport', SportsSchema);