angular.module('SportsService', [])

.factory('Sport', function($http) {

  // create a new object
  var SportsFactory = {};
  var savedSport;

  // get all books
  SportsFactory.all = function(current){
    return $http.get('/api/sports/' , current);
  };

  // add a match
  SportsFactory.create = function(matchData) {
    return $http.post('/api/sports', matchData);
  };

  // find a book by ID Number
  SportsFactory.findSportbyIDNum = function(id) {
    return $http.get('/api/sports/' + id);
  };

  // find a match by ID Number
  SportsFactory.updateSportByID = function(id, SportData) {
    console.log(SportData);
    return $http.put('/api/sports/' + id, SportData);
  };

  // delete a book
  SportsFactory.delete = function(id) {
    return $http.delete('/api/sports/' + id);
  };

  // find match data
  SportsFactory.findData = function(dataField,searchText) {
    var config = { params:{
                field: dataField,
                search:searchText
              }};
    return $http.get('/api/sportsData/',config);
  };

  SportsFactory.setcurrentEditSport = function(sport){
    savedSport = sport;
  }

  SportsFactory.getcurrentEditSport = function(){
    return savedSport;
  }

  return SportsFactory;

});