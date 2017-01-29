angular.module('MealService', [])

.factory('Meal', function($http) {

  // create a new object
  var MealFactory = {};

  // get all meals
  MealFactory.all = function() {
    return $http.get('/api/meals/');
  };

  // get user meal
  MealFactory.mine = function(id) {
    return $http.get('/api/userMeals/' + id);
  };

  // get user meal
  MealFactory.inDay = function(pickDate) {
    return $http.get('/api/meals/' + pickDate);
  };

  // make a new change
  MealFactory.create = function(MealData) {
    return $http.post('/api/meals', MealData);
  };

  // delete a meal
  MealFactory.delete = function(id) {
    return $http.delete('/api/meals/' + id);
  };

  // delete a meal
  MealFactory.hasDiet = function(id) {
    return $http.get('/api/userDiets/' + id);
  };

  // get user numbers array
  MealFactory.getUserNumbers = function() {
    return $http.get('/api/allowedMealsNumber/');
  };

  // MEAL DATES LIMIT
  
  MealFactory.getCurrentDate = function() {
    var lastDateID = "581a49db56fb4a0103b26088"
    return $http.get('/api/lastdate/' + lastDateID);
  };

  MealFactory.updateCurrentDate = function(date) {
    var reqObject = {};
    reqObject.timestamp = date.getTime();
    reqObject.id = "581a49db56fb4a0103b26088";
    return $http.put('/api/lastdate/', reqObject);
  };

  MealFactory.addCurrentDate = function(date) {
    var reqObject = {};
    reqObject.timestamp = date.getTime();
    return $http.post('/api/lastdate/', reqObject);
  };

  return MealFactory;

});