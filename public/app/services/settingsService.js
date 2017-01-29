angular.module('SettingsService', [])

.factory('Settings', function($http) {

  // create a new object
  var SettingsFactory = {};
  var savedUser;

  // Get initial data count
  SettingsFactory.prepareData = function() {
    var config = { params:{
                    id: "581a49db56fb4a0103b26088"
                  }};
    return $http.get('/api/settings', config);
  };

  // Clear collection data
  SettingsFactory.clearCollection = function(collection) {
    if(collection == 'LastDate'){
      var reqObject = {};
      reqObject.timestamp = new Date('01/01/2000');
      reqObject.timestamp = reqObject.timestamp.getTime();
      reqObject.id = "581a49db56fb4a0103b26088";
      return $http.put('/api/lastdate/', reqObject);
    }else{
      var config = { params:{
                  chosen: collection
                }};
      return $http.delete('/api/settings/', config);
    }
  };

  // get all users
  SettingsFactory.all = function(current) {
    var config = { params:{
                    page: current
                  }};
    return $http.get('/api/users/', config);
  };

  // make a new change
  SettingsFactory.create = function(UserData) {
    return $http.post('/api/users', UserData);
  };

  // delete a meal
  SettingsFactory.delete = function(id) {
    return $http.delete('/api/users/' + id);
  };

  // find a user by ID Number
  SettingsFactory.findUserbyIDNum = function(id) {
    return $http.get('/api/users/' + id);
  };

  // Update user by ID Number
  SettingsFactory.updateUserByID = function(id, userData) {
    return $http.put('/api/users/' + id, userData);
  };

  SettingsFactory.setcurrentEditUser = function(user){
    savedUser = user;
  }

  SettingsFactory.getcurrentEditUser = function(){
    return savedUser;
  }

  SettingsFactory.clearcurrentEditUser = function(){
    savedUser = null;
  }
  
  return SettingsFactory;

});