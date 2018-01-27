angular.module('mealCtrl',[])

.controller('MealController', function($rootScope,Meal,$timeout,$mdDialog,$mdMedia, $q, $window) {

  var Meals = {};
  var vm=this;

  vm.pickDate = new Date();
  vm.repeat = false;
  vm.endDate = new Date();
  vm.currentDate = new Date();

  vm.numberOfBreakfasts = 0;
  vm.numberOfLunches = 0;
  vm.numberOfDinners = 0;

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
    /*  0 */ 'Como a las 13:00',
    /*  1 */ 'No como',
    /*  2 */ 'Como a las 15:15',
    /*  3 */ 'No ceno',
    /*  4 */ 'Ceno a las 22:00',
    /*  5 */ 'No desayuno',
    /*  6 */ 'Desayuno 7:15',
    /*  7 */ 'Bocadillos a las 11:30',
    /*  8 */ 'Bocadillos en desayuno a las 7:15',
    /*  9 */ 'Bocadillos en desayuno a las 8:15',
    /*  10 */'Invitar a comer a las 13:00',
    /*  11 */'Invitar a comer',
    /*  12 */'Invitar a comer a las 15:15',
    /*  13 */'Invitar a cenar',
  ];

  vm.dayBeforeIDkeys = [5,6,8,9];
  vm.breakfastRequests = [5,6];
  vm.lunchRequests = [0,1,2,7,8,9];
  vm.dinnerRequests = [3,4];

  vm.inviteRequests = [10,11,12,13];

  vm.checkInvites = function(key){
    if(vm.inviteRequests.indexOf(Number(key)) !== -1){
      return true;
    }else{
      return false;
    }
  }

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
    console.log(vm.mealAsked);
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
    console.log(vm.mealAsked);
    return true;
  }

  vm.addMealMoment = function(meal){
    if(vm.breakfastRequests.indexOf(meal.change) !== -1){
      meal.moment = 0;
    }else if(vm.lunchRequests.indexOf(meal.change) !== -1){
      meal.moment = 1;
    }else if(vm.dinnerRequests.indexOf(meal.change) !== -1){
      meal.moment = 2;
    }else if(meal.change === 10 || meal.change === 11 || meal.change === 12){
      meal.moment = 3;
    }else if(meal.change === 13){
      meal.moment = 4;
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
    vm.numberOfBreakfasts = 104;
    vm.numberOfLunches = 104;
    vm.numberOfDinners = 104;
    var d = new Date(date.getTime()-(1000*60*60*24));
    
    //Used for substracting meals
    Meal.inDay(date).success(function(data){
      data.map(function(e){
        if(vm.breakfastRequests.indexOf(e.change) !== -1){
          --vm.numberOfBreakfasts;
        }else if(vm.lunchRequests.indexOf(e.change) !== -1 && vm.dayBeforeIDkeys.indexOf(e.change) === -1){
          --vm.numberOfLunches;
        }else if(vm.dinnerRequests.indexOf(e.change) !== -1){
          --vm.numberOfDinners;
        }else if(e.change === 11){
          vm.numberOfLunches = vm.numberOfLunches + e.numInvites;
        }else if(e.change === 13){
          vm.numberOfDinners = vm.numberOfDinners + e.numInvites;
        }
        e.id = parseInt(e.id);
        vm.requests.push(e);
       });
    });
    
    /*
    Meal.inDay(date).success(function(data){
      data.map(function(e){
        if(e.change == 1){
          ++vm.numberOfLunches;
        }else if(e.change == 3){
          ++vm.numberOfDinners;
        }else if(e.change == 5){
          ++vm.numberOfBreakfasts
        }else if(e.change == 11){
          vm.numberOfLunches = vm.numberOfLunches + e.numInvites;
        }else if(e.change == 13){
          vm.numberOfDinners = vm.numberOfDinners + e.numInvites;
        }
        vm.requests.push(e);
      });
    });
    */
    
    Meal.inDay(d).success(function(data){
      data.map(function(e){
        if(vm.dayBeforeIDkeys.indexOf(e.change) !== -1){
          if(e.moment == 1){
            e.change = 1;
            --vm.numberOfLunches;
            e.id = parseInt(e.id);
            vm.requests.push(e);
          }else if(e.moment == 2){
            e.change = 3;
            --vm.numberOfDinners;
            e.id = parseInt(e.id);
            vm.requests.push(e);
          }
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