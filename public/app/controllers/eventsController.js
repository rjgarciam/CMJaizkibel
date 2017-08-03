angular.module('eventsCtrl', ['ngMaterial'])

.controller('EventsController', function($rootScope,Events) {
  var vm = this;

  vm.monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  vm.pageToken;

  vm.list = [];

  vm.getEvents = function(){
    return Events.mainCal(vm.pageToken)
            .then(function(data){
              var res = angular.fromJson(data.data);
              vm.pageToken = res.nextPageToken;
              res.items.map(function(e){
                e = prepareDates(e);
              });
              Array.prototype.push.apply(vm.list,res.items)
              //vm.list = res.items;
            });
  }

  prepareDates = function(item){
    if(!item.start.dateTime){
      item.start.dateTime = new Date(item.start.date);
    }else{
      item.start.dateTime = new Date(item.start.dateTime);
    }
    if(!item.end.dateTime){
      item.end.dateTime = new Date(item.end.date);
    }else{
      item.end.dateTime = new Date(item.end.dateTime);
    }
    if(item.end.dateTime.getDate() == item.start.dateTime.getDate()+1){
      item.start.wholeDay = true;
    }else{
      item.start.wholeDay = false;
    }
    if(!item.start.wholeDay && item.end.dateTime.getDay() != item.start.dateTime.getDay()){
      item.start.manyDays = true;
    }else{
      item.start.manyDays = false;
    }
    return item;
  }

});