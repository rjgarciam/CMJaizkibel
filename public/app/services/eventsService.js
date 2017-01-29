angular.module('EventsService', [])

.factory('Events', function($http) {

  // create a new object
  var EventsFactory = {};

  // get all events from given calendar
  EventsFactory.mainCal = function(calendarURL,APIKey) {
    var today = new Date();
    var maxDay = new Date(new Date().setDate(new Date().getDate()+7));
    var config = { params:{
                key:  APIKey,
                timeMin: today,
                singleEvents: true,
                orderBy: 'startTime',
                timeMax: maxDay,
              }};
    return $http.get('https://www.googleapis.com/calendar/v3/calendars/' + calendarURL + '/events', config);
  };

  return EventsFactory;

});