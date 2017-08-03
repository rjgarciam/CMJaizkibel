angular.module('EventsService', [])

.factory('Events', function($http) {

  // create a new object
  var EventsFactory = {};

  // get all events from given calendar
  EventsFactory.mainCal = function(pageToken) {
    var today = new Date();
    //var maxDay = new Date(new Date().setDate(new Date().getDate()+7));
    var config = { params:{
                minTime: today,
                pageToken: pageToken,
              }};
    return $http.get('/api/events/', config);
  };

  return EventsFactory;

});