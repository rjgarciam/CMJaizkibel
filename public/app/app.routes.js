angular.module('app.routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {

  $routeProvider

    // Meals section
    .when('/meals', {
      templateUrl : 'app/views/pages/meals.html',
      controller  : 'MealController',
          controllerAs: 'meals',
      data: {
        reqPermissions: 'isLogged',
        redirect: '/login',
      }
    })

    .when('/mealrequests', {
      templateUrl : 'app/views/pages/mealRequests.html',
      controller  : 'MealController',
          controllerAs: 'meals',
      data: {
        reqPermissions: 'meals',
        redirect: '/meals',
      }
    })

     
    // login section
    .when('/login', {
      templateUrl : 'app/views/pages/login.html',
        controller  : 'MainController',
          controllerAs: 'login',
      data: {
        reqPermissions: 'isLogged',
        redirect: '/meals',
      }
    })

    // Admin section
    .when('/settings', {
      templateUrl : 'app/views/pages/settings.html',
        controller  : 'SettingsController',
          controllerAs: 'settings',
      data: {
        reqPermissions: 'admin',
        redirect: '/meals',
      }
    })

    .when('/addUser', {
      templateUrl : 'app/views/pages/newUser.html',
        controller  : 'SettingsController',
          controllerAs: 'settings',
      data: {
        reqPermissions: 'admin',
        redirect: '/meals',
      }
    })

    .when('/usersList', {
      templateUrl : 'app/views/pages/usersList.html',
        controller  : 'SettingsController',
          controllerAs: 'settings',
      data: {
        reqPermissions: 'admin',
        redirect: '/meals',
      }
    })

    // Library section
    .when('/books', {
      templateUrl : 'app/views/pages/books.html',
        controller  : 'BooksController',
          controllerAs: 'books',
      data: {
        reqPermissions: 'isLogged',
        redirect: '/login',
      }
    })

    .when('/addBook', {
      templateUrl : 'app/views/pages/newBook.html',
        controller  : 'BooksController',
          controllerAs: 'books',
      data: {
        reqPermissions: 'library',
        redirect: '/books',
      }
    })

    .when('/myBooks', {
      templateUrl : 'app/views/pages/myBooks.html',
        controller  : 'BooksController',
          controllerAs: 'books',
      data: {
        reqPermissions: 'isLogged',
        redirect: '/login',
      }
    })

    .when('/booksTaken', {
      templateUrl : 'app/views/pages/booksTaken.html',
        controller  : 'BooksController',
          controllerAs: 'books',
      data: {
        reqPermissions: 'library',
        redirect: '/books',
      }
    })

    // Events section
    .when('/events', {
      templateUrl : 'app/views/pages/events.html',
        controller  : 'EventsController',
          controllerAs: 'events',
      data: {
        reqPermissions: 'isLogged',
        redirect: '/login',
      }
    })

    // Sports section
    .when('/sports', {
      templateUrl : 'app/views/pages/sports.html',
        controller  : 'SportsController',
          controllerAs: 'sports',
      data: {
        reqPermissions: 'isLogged',
        redirect: '/login',
      }
    })

    .when('/addSport', {
      templateUrl : 'app/views/pages/newSport.html',
        controller  : 'SportsController',
          controllerAs: 'sports',
      data: {
        reqPermissions: 'isLogged',
        redirect: '/login',
      }
    })

    //Offline route for SW
    .when('/offline', {
      templateUrl : 'app/views/pages/offline.html',
        controller  : 'MainController',
          controllerAs: 'login',
      data: {
        reqPermissions: 'isLogged',
        redirect: '/offline',
      }
    })


    .otherwise({ redirectTo: '/meals'})

  $locationProvider.html5Mode(true);

});
