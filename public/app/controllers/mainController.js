angular.module('mainCtrl', ['ngMaterial',])

.controller('MainController', function($rootScope, $location, Auth,$window,$scope) {
  var vm = this;
  vm.errorLogIn = false;

  $scope.currentNavItem = $location.path();
  
  vm.checkErrors = function(){
  	if($location.hash() == 'error'){
		vm.errorLogIn = true;
  	}
  }

  vm.goLogIn = function(){
  	$window.location.href = '/api/auth/google';
  }

  $rootScope.userData = Auth;

  vm.logOut = function(){
    Auth.logOut();
    $window.location.href = '/login';
  };
});