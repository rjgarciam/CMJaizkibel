angular.module('cmolabidea', ['ngAnimate', 'ngMessages', 'app.routes', 'AuthService', 'mainCtrl','ngMaterial','angular-jwt','mealCtrl', 'MealService', 'settingsCtrl', 'SettingsService','bookCtrl', 'BookService','angular.filter','eventsCtrl','EventsService','sportsCtrl','SportsService'])

.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('indigo', {
      'default': '700',
      'hue-1': '800',
      'hue-2': '900',
    })
    .accentPalette('blue', {
      'default': '200'
    });
})

.config(function ($httpProvider,$mdDateLocaleProvider) {
  $httpProvider.interceptors.push('authInterceptor');
  $mdDateLocaleProvider.formatDate = function(date) {
   return date ? moment(date).format('DD-MM-YYYY') : '';
  };
  $mdDateLocaleProvider.parseDate = function(dateString) {
   var m = moment(dateString, 'DD-MM-YYYY', true);
   return m.isValid() ? m.toDate() : new Date(NaN);
  };
  $mdDateLocaleProvider.firstDayOfWeek = 1;
})

.run(function ($rootScope, $location) {
  $rootScope.$on('$routeChangeStart', function (event, next, current) {
    // if route requires auth and user is not logged in
    var authorizedRoles = next.data.reqPermissions;
    var redirect = next.data.redirect;
    if(next.originalPath != '/offline'){
      if (next.originalPath != '/login' && $rootScope.userData[authorizedRoles] != true) {
        event.preventDefault();
        $location.path(redirect);
      }else if(next.originalPath == '/login' && $rootScope.userData[authorizedRoles] == true){
        event.preventDefault();
        $location.path(redirect);
      }
    }else{
      $rootScope.userData.isLogged = false;
    }
  });
})

// Check for network availability (for PWA)
.run(function($window, $rootScope, $location) {
      $rootScope.online = navigator.onLine;
      $window.addEventListener("offline", function() {
        $rootScope.$apply(function() {
          $rootScope.online = false;
          $location.path('/offline');
        });
      }, false);

      $window.addEventListener("online", function() {
        $rootScope.$apply(function() {
          $rootScope.online = true;
          $location.path('/meals');
        });
      }, false);
})

/* 
  Directive from https://mark.zealey.org/2015/01/08/formatting-time-inputs-nicely-with-angularjs
 */             
.directive('ngModel', function( $filter ) {
    return {
        require: '?ngModel',
        link: function(scope, elem, attr, ngModel) {
            if( !ngModel )
                return;
            if( attr.type !== 'Time' )
                return;
                    
            ngModel.$formatters.unshift(function(value) {
                return value.replace(/:[0-9]{2}\.[0-9]{3}$/, '')
            });
        }
    }   
})

.directive('customOnChange', function() {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var onChangeHandler = scope.$eval(attrs.customOnChange);
      element.bind('change', onChangeHandler);
    }
  };
});