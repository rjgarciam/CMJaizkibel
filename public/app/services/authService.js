angular.module('AuthService', ['ngCookies','angular-jwt'])

.factory('Auth', ['$http', '$q', '$cookies', 'jwtHelper', function($http, $q, $cookies, jwtHelper) {

  var vm = this;

  var userData = {isLogged:false,email:'',meals:false,library:false,admin:false,number:0,hasDiet:false,dietContent:'',name:''};

  var token = $cookies.get('cmayete');
  
  if(token){
    var decoded = jwtHelper.decodeToken(token);

    if(decoded && !jwtHelper.isTokenExpired(token)){
        userData.number = decoded.number;
        userData.isLogged = decoded.isLogged;
        userData.email = decoded.email;
        userData.meals = decoded.meals;
        userData.lockMeals = decoded.lockMeals;
        userData.library = decoded.library;
        userData.admin = decoded.admin;
        userData.hasDiet = decoded.hasDiet;
        userData.dietContent = decoded.dietContent;
        userData.name = decoded.name;
    }
  }

  userData.logOut = function(){
    $cookies.remove('cmayete');
  };

  return userData;

}])

.factory('authInterceptor', function ($rootScope, $q, $cookies) {
  return {
    request: function (config) {
      var token = $cookies.get('cmayete');
      config.headers = config.headers || {};
      if (token) {
        config.headers['x-access-token'] = token;
      }
      return config;
    },
    response: function (response) {
      return response || $q.when(response);
    }
  };
});