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
    /*  0 */ 'Tachar el desayuno' ,
    /*  1 */ 'Tachar la comida',
    /*  2 */ 'Tachar la cena',
    /*  3 */ 'Desayunar antes',
    /*  4 */ 'Bocadillos en primer turno',
    /*  5 */ 'Tupper en primer turno',
    /*  6 */ 'Comer de Tupper',
    /*  7 */ 'Comer de Bocadillos',
    /*  8 */ 'Bolsa de bocadillos antes de las 13:00',
    /*  9 */ 'Comida de primer turno',
    /* 10 */ 'Comida de segundo turno',
    /* 11 */ 'Cena de segundo turno',
  ];

  vm.dayBeforeIDkeys = [0,3,4,5,6,7];
  vm.breakfastRequests = [0,3];
  vm.lunchRequests = [1,4,5,6,7,8,9,10];
  vm.dinnerRequests = [2,11];

  vm.selectedRequest = 2;

  vm.mealAsked = {};
  vm.mealAsked.id = $rootScope.userData.number;
  vm.mealAsked.date = new Date();
  vm.mealAsked.reqDate = new Date();  
  vm.mealAsked.doRepeat = 0;
  console.log($rootScope.userData);
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
      console.log("hi!");
      console.log(vm.mealAsked);
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
        console.log(data);
      });
    Meal.inDay(d).success(function(data){
      data.map(function(e){
        if(vm.dayBeforeIDkeys.indexOf(e.change) !== -1){
          if(e.moment == 1){
            e.change = 1;
          }else if(e.moment == 2){
            e.change = 2;
          }
          vm.requests.push(e);
        }
      });
    });
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
    console.log("Kaixo!");
    Meal.hasDiet(meal.id)
      .success(function(data){
        //To avoid undefined warnings
        console.log(data);
        if(data[0]){
          if(data[0].hasDiet){
            console.log(data[0]);
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
});