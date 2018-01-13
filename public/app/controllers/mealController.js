angular.module('mealCtrl',[])

.controller('MealController', function($rootScope,Meal,$timeout,$mdDialog,$mdMedia, $q, $window) {

  var Meals = {};
  var vm=this;

  vm.pickDate = new Date();
  vm.repeat = false;
  vm.endDate = new Date();
  vm.currentDate = new Date();

  vm.possibleRepeats = [
    {id: 1, name: 'Cada día'},
    {id: 7, name: 'Cada semana'}
  ]

  vm.screenSize = $window.innerWidth;

  $window.onresize = function(event){
    $timeout(function(){
      vm.screenSize = $window.innerWidth;
    });
  };

  vm.possibleRequests = [
    /*  0 */ 'Como',
    /*  1 */ 'Ceno',
    /*  2 */ 'Como de Tupper',
    /*  3 */ 'Como pronto',
    /*  4 */ 'Como tarde',
    /*  5 */ 'Ceno tarde',
  ];

  vm.dayBeforeIDkeys = [2];
  vm.breakfastRequests = [];
  vm.lunchRequests = [0,2,3,4];
  vm.dinnerRequests = [1,5];

  vm.selectedRequest = 2;

  vm.mealAsked = {};
  vm.mealAsked.id = $rootScope.userData.number;
  vm.mealAsked.date = new Date();
  vm.mealAsked.reqDate = new Date();  
  vm.mealAsked.doRepeat = 0;
  vm.mealAsked.hasDiet = $rootScope.userData.hasDiet;
  vm.mealAsked.dietContent = $rootScope.userData.dietContent;
  vm.mealAsked.name = $rootScope.userData.name;
  vm.mealButtontext = 'Enviar';

  // Ask for a new meal change
  vm.askMeal = function() {
    vm.processing = true;
    vm.mealButtontext = '';
    if(vm.verifyMeal()){
      if(vm.repeat){
        vm.pushArray = true;
        var promiseArray = [];
        var i=0;
        while(vm.mealAsked.date <= vm.mealAsked.endDate && promiseArray.length < 15){
          promiseArray.push(Meal.create(angular.copy(vm.mealAsked)));
          vm.mealAsked.date = new Date(vm.mealAsked.date.setDate(vm.mealAsked.date.getDate()+Number(vm.mealAsked.doRepeat)));
          vm.mealAsked.reqDate = new Date(vm.mealAsked.reqDate.setDate(vm.mealAsked.reqDate.getDate()+Number(vm.mealAsked.doRepeat)));
          if(!vm.verifyMeal()){
            vm.pushArray = false;
          }
        }
        if(!vm.pushArray){
          $q.all(promiseArray)
          .then(
            function () {
              vm.processing = false;
              vm.mealButtontext = 'Enviado';
              vm.myMeals();
            },
            function () {
              vm.processing = false;
              vm.mealButtontext = 'Error';
              vm.mealError = true;
            }
          );
        }
      }else{
        //Create the meal with special response to errors or success
        Meal.create(vm.mealAsked).then(function succesCallback(){
            vm.processing = false;
            vm.mealButtontext = 'Enviado';
            vm.myMeals();
        },function errorCallback(){
            vm.processing = false;
            vm.mealButtontext = 'Error';
            vm.mealError = true;
        });
      }
    }else{
      vm.mealButtontext = 'Error';
      vm.mealError = true;
    }
    // Get the button back to normal  
    $timeout(function(){
    vm.mealButtontext = 'Enviar';
    vm.mealError = false;
    },3000);
  }

  vm.verifyMeal = function(){
    vm.mealAsked.date.setHours(0,0,0,0);
    vm.mealAsked.reqDate = angular.copy(vm.mealAsked.date);
    if(vm.dayBeforeIDkeys.indexOf(vm.mealAsked.change) !== -1){
      vm.mealAsked.reqDate = new Date(vm.mealAsked.reqDate.setDate(vm.mealAsked.reqDate.getDate()-1));
    }
    if((!vm.mealAsked.change && vm.mealAsked.change!=0) || !vm.mealAsked.date){
      return false;
    }
    if(vm.mealAsked.reqDate < vm.currentDate){
      return false;
    }
    if(vm.repeat){
      if(vm.mealAsked.reqDate >= vm.mealAsked.endDate){
        return false;
      }
      if(vm.mealAsked.endDate < vm.currentDate){
        return false;
      }
    }
    vm.addMealMoment(vm.mealAsked);
    return true;
  }

  vm.addMealMoment = function(meal){
    if(vm.breakfastRequests.indexOf(meal.change) !== -1){
      meal.moment = 0;
    }
    if(vm.lunchRequests.indexOf(meal.change) !== -1){
      meal.moment = 1;
    }
    if(vm.dinnerRequests.indexOf(meal.change) !== -1){
      meal.moment = 2;
    }
  }

  vm.myMeals = function() {
    Meal.mine($rootScope.userData.number)
      .success(function(data) {
        vm.processing = false;
        data.map(function(e){
          e.date = new Date(e.date);
          e.reqDate = new Date(e.reqDate);
        });
        vm.myRequests = data;
      });
  }

  vm.getMeals = function(date) {
    vm.requests = [];
    var d = new Date(date.getTime()-(1000*60*60*24));
    Meal.inDay(date)
      .success(function(data){
        vm.processing = false;
        vm.requests = data;
      });
    /* Auto-SignUp meals
    Meal.inDay(d).success(function(data){
      data.map(function(e){
        if(vm.dayBeforeIDkeys.indexOf(e.change) !== -1){
          if(e.moment == 1){
            e.change = 0;
          }else if(e.moment == 2){
            e.change = 1;
          }
          vm.requests.push(e);
        }
      });
    });
    */
  }

  // function to delete a change
  vm.deleteRequest = function(id) {
    vm.processing = true;
    Meal.delete(id)
      .success(function(data) {
        vm.myMeals();
    });
  };

  vm.checkDiets = function(meal){
    Meal.hasDiet(meal.id)
      .success(function(data){
        //To avoid undefined warnings
        if(data[0]){
          if(data[0].hasDiet){
            return meal.dietMeal = data[0].dietContent;
          }
        }
      });
  }

  /* Retrieve an array of valid user numbers */

  vm.allUserNumbers = function(){
    Meal.getUserNumbers().success(function(data){
      vm.userNumbersArray = data;
    })
  }

  /*
      Manage the minimum day for the input form
  */
  
  // Retrieve last authorised day from db
  vm.getLastDay = function() {
	  Meal.getCurrentDate()
	    .success(function(data) {
        vm.currentDate = new Date(data[0].date);
	  	});
  };


  // Change to current day
  vm.NewDate = function() {
    vm.processing = true;
    vm.message = '';
    date = new Date(new Date().setDate(new Date().getDate()+1));
    date.setHours(0,0,0,0);
    Meal.updateCurrentDate(date)
      .success(function(data) {
        vm.processing = false;
        vm.currentDate = date;
      });
  };

  vm.confirmDate = function(event) {
    var confirm = $mdDialog.confirm()
          .title('¿Estás seguro?')
          .textContent('Se cerrará el parte de comidas para hoy.')
          .ariaLabel('Confirmar')
          .ok('Continuar')
          .cancel('Cancelar')
          .targetEvent(event);
    $mdDialog.show(confirm).then(function() {
      vm.NewDate();
    });
  };

});