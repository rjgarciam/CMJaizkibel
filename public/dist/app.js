angular.module("cmjaizkibel",["ngAnimate","ngMessages","app.routes","AuthService","mainCtrl","ngMaterial","angular-jwt","mealCtrl","MealService","settingsCtrl","SettingsService","bookCtrl","BookService","angular.filter","eventsCtrl","EventsService","sportsCtrl","SportsService"]).config(["$mdThemingProvider",function(e){e.theme("default").primaryPalette("indigo",{"default":"700","hue-1":"800","hue-2":"900"}).accentPalette("orange",{"default":"500"})}]).config(["$httpProvider","$mdDateLocaleProvider",function(e,t){e.interceptors.push("authInterceptor"),t.formatDate=function(e){return e?moment(e).format("DD-MM-YYYY"):""},t.parseDate=function(e){var t=moment(e,"DD-MM-YYYY",!0);return t.isValid()?t.toDate():new Date(NaN)},t.firstDayOfWeek=1}]).run(["$rootScope","$location",function(e,t){e.$on("$routeChangeStart",function(n,a,r){var o=a.data.reqPermissions,s=a.data.redirect;"/offline"!=a.originalPath?"/login"!=a.originalPath&&1!=e.userData[o]?(n.preventDefault(),t.path(s)):"/login"==a.originalPath&&1==e.userData[o]&&(n.preventDefault(),t.path(s)):e.userData.isLogged=!1})}]).run(["$window","$rootScope","$location",function(e,t,n){t.online=navigator.onLine,e.addEventListener("offline",function(){t.$apply(function(){t.online=!1,n.path("/offline")})},!1),e.addEventListener("online",function(){t.$apply(function(){t.online=!0,n.path("/meals")})},!1)}]).directive("ngModel",["$filter",function(e){return{require:"?ngModel",link:function(e,t,n,a){a&&"Time"===n.type&&a.$formatters.unshift(function(e){return e.replace(/:[0-9]{2}\.[0-9]{3}$/,"")})}}}]).directive("customOnChange",function(){return{restrict:"A",link:function(e,t,n){var a=e.$eval(n.customOnChange);t.bind("change",a)}}}),angular.module("app.routes",["ngRoute"]).config(["$routeProvider","$locationProvider",function(e,t){e.when("/meals",{templateUrl:"app/views/pages/meals.html",controller:"MealController",controllerAs:"meals",data:{reqPermissions:"isLogged",redirect:"/login"}}).when("/mealrequests",{templateUrl:"app/views/pages/mealRequests.html",controller:"MealController",controllerAs:"meals",data:{reqPermissions:"meals",redirect:"/meals"}}).when("/login",{templateUrl:"app/views/pages/login.html",controller:"MainController",controllerAs:"login",data:{reqPermissions:"isLogged",redirect:"/meals"}}).when("/settings",{templateUrl:"app/views/pages/settings.html",controller:"SettingsController",controllerAs:"settings",data:{reqPermissions:"admin",redirect:"/meals"}}).when("/addUser",{templateUrl:"app/views/pages/newUser.html",controller:"SettingsController",controllerAs:"settings",data:{reqPermissions:"admin",redirect:"/meals"}}).when("/usersList",{templateUrl:"app/views/pages/usersList.html",controller:"SettingsController",controllerAs:"settings",data:{reqPermissions:"admin",redirect:"/meals"}}).when("/books",{templateUrl:"app/views/pages/books.html",controller:"BooksController",controllerAs:"books",data:{reqPermissions:"isLogged",redirect:"/login"}}).when("/addBook",{templateUrl:"app/views/pages/newBook.html",controller:"BooksController",controllerAs:"books",data:{reqPermissions:"library",redirect:"/books"}}).when("/myBooks",{templateUrl:"app/views/pages/myBooks.html",controller:"BooksController",controllerAs:"books",data:{reqPermissions:"isLogged",redirect:"/login"}}).when("/booksTaken",{templateUrl:"app/views/pages/booksTaken.html",controller:"BooksController",controllerAs:"books",data:{reqPermissions:"library",redirect:"/books"}}).when("/events",{templateUrl:"app/views/pages/events.html",controller:"EventsController",controllerAs:"events",data:{reqPermissions:"isLogged",redirect:"/login"}}).when("/sports",{templateUrl:"app/views/pages/sports.html",controller:"SportsController",controllerAs:"sports",data:{reqPermissions:"isLogged",redirect:"/login"}}).when("/addSport",{templateUrl:"app/views/pages/newSport.html",controller:"SportsController",controllerAs:"sports",data:{reqPermissions:"isLogged",redirect:"/login"}}).when("/offline",{templateUrl:"app/views/pages/offline.html",controller:"MainController",controllerAs:"login",data:{reqPermissions:"isLogged",redirect:"/offline"}}).otherwise({redirectTo:"/meals"}),t.html5Mode(!0)}]),angular.module("bookCtrl",["ngMaterial"]).controller("BooksController",["Book","$rootScope","$location",function(e,t,n){var a=this;a.currentPage=1,a.numPages,a.isUpdate=!1,a.sendButtonText="Enviar",a.searchAll="",a.search={apellidos:[""],nombre:[""],titulo:[""],idioma:[""],lugar:[""]},a.book={numero:"",letra:"",apellidos:"",nombre:"",titulo:"",idioma:"",lugar:"",enUso:"",fecha:""},e.getcurrentEditBook()&&(e.findBookbyIDNum(e.getcurrentEditBook()).then(function(e){a.book=e.data}),a.isUpdate=!0,a.sendButtonText="Actualizar"),a.getBooks=function(){e.all(a.searchAll,a.currentPage).success(function(e){a.processing=!1,a.books=e.books,a.numPages=e.nump})},a.deleteBook=function(t){a.processing=!0,e["delete"](t).success(function(e){a.processing=!1,n.path("/books")})},a.addNew=function(){e.create(a.book).success(function(){n.path("/books")}).error(function(){a.sendButtonText="Error"})},a.editedBook=function(){e.updateBookByID(a.book._id,a.book).success(function(){n.path("/books")}).error(function(){a.sendButtonText="Error"})},a.nextPressed=function(){++a.currentPage,a.getBooks()},a.prevPressed=function(){--a.currentPage,a.getBooks()},a.bookData=function(t,n){return e.findData(t,n).then(function(e){return a.processing=!1,e.data})},a.newData=function(e,t){a.book[t]=e},a.selectedItemChange=function(e,t){a.book[t]=e},a.getUserBooks=function(){e.getMyBooks(t.userData.number).success(function(e){a.processing=!1,a.myBooks=e})},a.takeBook=function(n){e.manageMyBook(n,t.userData.number).success(function(e){a.processing=!1,a.getBooks()})},a.returnBook=function(t){e.manageMyBook(t,null).success(function(e){a.processing=!1,a.getUserBooks()})},a.getBooksTaken=function(){e.allBooksTaken(a.currentPage).success(function(e){a.processing=!1,a.books=e.books,a.numPages=e.nump})},a.addBook=function(){e.clearcurrentEditBook(),n.path("/addBook")},a.editBook=function(t){e.setcurrentEditBook(t),n.path("/addBook")}}]),angular.module("eventsCtrl",["ngMaterial"]).controller("EventsController",["$rootScope","Events",function(e,t){var n=this;n.monthNames=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],n.list=[],n.getEvents=function(){return t.mainCal("ayete.es_pu5p3ltp22t89tvn783vuoph84@group.calendar.google.com",e.userData.GCalendarAPI).then(function(e){e.data.items.map(function(e){e=prepareDates(e)}),n.list=e.data.items})},prepareDates=function(e){return e.start.dateTime?e.start.dateTime=new Date(e.start.dateTime):e.start.dateTime=new Date(e.start.date),e.end.dateTime?e.end.dateTime=new Date(e.end.dateTime):e.end.dateTime=new Date(e.end.date),e.end.dateTime.getDate()==e.start.dateTime.getDate()+1?e.start.wholeDay=!0:e.start.wholeDay=!1,e.start.wholeDay||e.end.dateTime.getDay()==e.start.dateTime.getDay()?e.start.manyDays=!1:e.start.manyDays=!0,e}}]),angular.module("mainCtrl",["ngMaterial"]).controller("MainController",["$rootScope","$location","Auth","$window","$scope",function(e,t,n,a,r){var o=this;o.errorLogIn=!1,r.currentNavItem=t.path(),o.checkErrors=function(){"error"==t.hash()&&(o.errorLogIn=!0)},o.goLogIn=function(){a.location.href="/api/auth/google"},e.userData=n,o.logOut=function(){n.logOut(),a.location.href="/login"}}]),angular.module("mealCtrl",[]).controller("MealController",["$rootScope","Meal","$timeout","$mdDialog","$mdMedia","$q","$window",function(e,t,n,a,r,o,s){var i=this;i.pickDate=new Date,i.repeat=!1,i.endDate=new Date,i.currentDate=new Date,i.possibleRepeats=[{id:1,name:"Cada día"},{id:7,name:"Cada semana"}],i.screenSize=s.innerWidth,s.onresize=function(e){n(function(){i.screenSize=s.innerWidth})},i.possibleRequests=["Tachar la comida","Tachar la cena","Comer de Tupper","Comida pronto","Comida tarde","Cena tarde"],i.dayBeforeIDkeys=[2],i.breakfastRequests=[],i.lunchRequests=[0,2,3,4],i.dinnerRequests=[1,5],i.selectedRequest=2,i.mealAsked={},i.mealAsked.id=e.userData.number,i.mealAsked.date=new Date,i.mealAsked.reqDate=new Date,i.mealAsked.doRepeat=0,i.mealAsked.hasDiet=e.userData.hasDiet,i.mealAsked.dietContent=e.userData.dietContent,i.mealAsked.name=e.userData.name,i.mealButtontext="Enviar",i.askMeal=function(){if(i.processing=!0,i.mealButtontext="",i.verifyMeal())if(i.repeat){i.pushArray=!0;for(var e=[];i.mealAsked.date<=i.mealAsked.endDate&&e.length<15;)e.push(t.create(angular.copy(i.mealAsked))),i.mealAsked.date=new Date(i.mealAsked.date.setDate(i.mealAsked.date.getDate()+Number(i.mealAsked.doRepeat))),i.mealAsked.reqDate=new Date(i.mealAsked.reqDate.setDate(i.mealAsked.reqDate.getDate()+Number(i.mealAsked.doRepeat))),i.verifyMeal()||(i.pushArray=!1);i.pushArray||o.all(e).then(function(){i.processing=!1,i.mealButtontext="Enviado",i.myMeals()},function(){i.processing=!1,i.mealButtontext="Error",i.mealError=!0})}else t.create(i.mealAsked).then(function(){i.processing=!1,i.mealButtontext="Enviado",i.myMeals()},function(){i.processing=!1,i.mealButtontext="Error",i.mealError=!0});else i.mealButtontext="Error",i.mealError=!0;n(function(){i.mealButtontext="Enviar",i.mealError=!1},3e3)},i.verifyMeal=function(){if(i.mealAsked.date.setHours(0,0,0,0),i.mealAsked.reqDate=angular.copy(i.mealAsked.date),i.dayBeforeIDkeys.indexOf(i.mealAsked.change)!==-1&&(i.mealAsked.reqDate=new Date(i.mealAsked.reqDate.setDate(i.mealAsked.reqDate.getDate()-1))),!i.mealAsked.change&&0!=i.mealAsked.change||!i.mealAsked.date)return!1;if(i.mealAsked.reqDate<i.currentDate)return!1;if(i.repeat){if(i.mealAsked.reqDate>=i.mealAsked.endDate)return!1;if(i.mealAsked.endDate<i.currentDate)return!1}return i.addMealMoment(i.mealAsked),!0},i.addMealMoment=function(e){i.breakfastRequests.indexOf(e.change)!==-1&&(e.moment=0),i.lunchRequests.indexOf(e.change)!==-1&&(e.moment=1),i.dinnerRequests.indexOf(e.change)!==-1&&(e.moment=2)},i.myMeals=function(){t.mine(e.userData.number).success(function(e){i.processing=!1,e.map(function(e){e.date=new Date(e.date),e.reqDate=new Date(e.reqDate)}),i.myRequests=e})},i.getMeals=function(e){i.requests=[];var n=new Date(e.getTime()-864e5);t.inDay(e).success(function(e){i.processing=!1,i.requests=e}),t.inDay(n).success(function(e){e.map(function(e){i.dayBeforeIDkeys.indexOf(e.change)!==-1&&(1==e.moment?e.change=1:2==e.moment&&(e.change=2),i.requests.push(e))})})},i.deleteRequest=function(e){i.processing=!0,t["delete"](e).success(function(e){i.myMeals()})},i.checkDiets=function(e){t.hasDiet(e.id).success(function(t){if(t[0]&&t[0].hasDiet)return e.dietMeal=t[0].dietContent})},i.allUserNumbers=function(){t.getUserNumbers().success(function(e){i.userNumbersArray=e})},i.getLastDay=function(){t.getCurrentDate().success(function(e){i.currentDate=new Date(e[0].date)})},i.NewDate=function(){i.processing=!0,i.message="",date=new Date((new Date).setDate((new Date).getDate()+1)),date.setHours(0,0,0,0),t.updateCurrentDate(date).success(function(e){i.processing=!1,i.currentDate=date})}}]),angular.module("settingsCtrl",["ngMaterial"]).controller("SettingsController",["$rootScope","$location","Settings","$window","$mdDialog","$q",function(e,t,n,a,r,o){var s=this;s.settingsData={lastMealsDate:new Date,mealsInDB:0,usersInDB:0,booksInDB:0,matchesInDB:0},s.user={name:"",email:"",number:"",admin:!1,meals:!1,hasDiet:!1,dietContent:""},s.currentPage=1,s.numPages,s.sendButtonText="Enviar",s.isUpdate=!1,s.processing=!1,s.errors=!1,s.newUsersNumber=0,s.uploadDone=!1,s.gotoUsersList=function(){t.path("/usersList")},s.gotoAddUser=function(){t.path("/addUser")},s.clearAll=function(e){n.clearCollection(e).then(function(e){s.loadSettingsData()})},s.loadSettingsData=function(){n.prepareData().success(function(e){s.settingsData=e})},n.getcurrentEditUser()&&(n.findUserbyIDNum(n.getcurrentEditUser()).then(function(e){s.user=e.data}),s.isUpdate=!0,s.sendButtonText="Actualizar"),s.openDial=function(e,t,n){var a=r.confirm().title("¿Estás seguro?").textContent("Esta acción no se podrá deshacer.").ariaLabel("Confirmar").ok("Continuar").cancel("Cancelar").targetEvent(n);r.show(a).then(function(){e(t)})},s.getUsers=function(){n.all(s.currentPage).success(function(e){s.processing=!1,s.users=e.users,s.numPages=e.nump})},s.nextPressed=function(){++s.currentPage,s.getUsers()},s.prevPressed=function(){--s.currentPage,s.getUsers()},s.deleteUser=function(e){s.processing=!0,n["delete"](e).success(function(e){s.processing=!1,s.users=e,t.path("/usersList")})},s.isChecked=function(e){return s.user[e]},s.toggle=function(e){return s.user[e]=!s.user[e],s.user[e]},s.addNewUser=function(){n.create(s.user).success(function(e){s.sendButtonText="Enviado",t.path("/usersList")})},s.addUser=function(){n.clearcurrentEditUser(),t.path("/addUser")},s.editUser=function(e){n.setcurrentEditUser(e),t.path("/addUser")},s.editedUser=function(){n.updateUserByID(s.user._id,s.user).success(function(e){t.path("/usersList")})},s.showUploadFileDialog=function(e){r.show({contentElement:"#uploadFileDialog",parent:angular.element(document.body),clickOutsideToClose:!1,escapeToClose:!1,fullscreen:!1})},s.hideDial=function(){r.hide(),s.uploadDone=!1},s.processCSV=function(e){var t=e.target.files;Papa.parse(t[0],{complete:function(e){e.data.splice(0,1),s.newUsersNumber=e.data.length,s.uploadMultipleUsers(e.data)}})},s.uploadMultipleUsers=function(e){s.processing=!0,s.uploadDone=!0,n.clearCollection("User").then(function(){s.showUploadFileDialog();var t=[],a={};e.map(function(e){var r;for(r=3;r<5;++r)"no"===e[r]?e[r]=!1:e[r]=!0;a={name:e[0],email:e[1].toLowerCase(),number:e[2],admin:e[3],meals:e[4]},""===e[5]?a.hasDiet=!1:(a.hasDiet=!0,a.dietContent=e[5]),t.push(n.create(angular.copy(a)))}),o.all(t).then(function(){s.processing=!1,s.loadSettingsData()},function(){s.processing=!1,s.errors=!0})})}}]),angular.module("sportsCtrl",["ngMaterial"]).controller("SportsController",["Sport","$location",function(e,t){var n=this;n.isUpdate=!1,n.search="",n.sendButtonText="Enviar",n.numPages,n.matches,n.currentPage=1,n.match={name:"",place:"",playersPerTeam:1,numberOfTeams:2,date:new Date,startTime:new Date,endTime:new Date,isLocked:!1,playersList:{},waitingList:!1},e.getcurrentEditSport()&&(e.findSportbyIDNum(e.getcurrentEditSport()).then(function(e){e.data.playersList=e.data.playersList[0],e.data.date=new Date(e.data.date),e.data.startTime=new Date(e.data.startTime),e.data.endTime=new Date(e.data.endTime),n.match=e.data}),n.isUpdate=!0,n.sendButtonText="Actualizar"),n.getSports=function(){e.all(n.currentPage).success(function(e){n.processing=!1,n.matches=e.matches,n.numPages=e.nump})},n.getNumber=function(e){return new Array(e)},n.editedMatch=function(){console.log(typeof n.match.playersList),console.log(n.match)},n.addMatch=function(){e.create(n.match).success(function(e){t.path("/sports")})},n.deleteMatch=function(a){n.processing=!0,e["delete"](a).success(function(e){n.processing=!1,t.path("/sports")})},n.matchData=function(t,a){return e.findData(t,a).then(function(e){return n.processing=!1,e.data})},n.selectedItemChange=function(e,t){n.match.place=e},n.newData=function(e,t){n.match.place=e},n.nextPressed=function(){++n.currentPage,n.getSports()},n.prevPressed=function(){--n.currentPage,n.getSports()},n.editedMatch=function(){e.updateSportByID(n.match._id,n.match).success(function(e){t.path("/sports")})},n.editMatch=function(n){e.setcurrentEditSport(n),t.path("/addSport")},n.playersNum=function(e){var t=0,n=0;for(n=0;n<e.numberOfTeams;++n)e.playersList[0]&&e.playersList[0][n]&&(t+=Object.keys(e.playersList[0][n]).length);return t}}]),angular.module("AuthService",["ngCookies","angular-jwt"]).factory("Auth",["$http","$q","$cookies","jwtHelper",function(e,t,n,a){var r={isLogged:!1,email:"",meals:!1,library:!1,admin:!1,number:0,hasDiet:!1,dietContent:"",name:""},o=n.get("cmayete");if(o){var s=a.decodeToken(o);s&&!a.isTokenExpired(o)&&(r.number=s.number,r.isLogged=s.isLogged,r.email=s.email,r.meals=s.meals,r.library=s.library,r.admin=s.admin,r.GCalendarAPI=s.calendarAPI,r.hasDiet=s.hasDiet,r.dietContent=s.dietContent,r.name=s.name)}return r.logOut=function(){n.remove("cmayete")},r}]).factory("authInterceptor",["$rootScope","$q","$cookies",function(e,t,n){return{request:function(e){var t=n.get("cmayete");return e.headers=e.headers||{},t&&(e.headers["x-access-token"]=t),e},response:function(e){return e||t.when(e)}}}]),angular.module("BookService",[]).factory("Book",["$http",function(e){var t,n={};return n.all=function(t,n){var a={params:{search:t,page:n}};return e.get("/api/books/",a)},n.create=function(t){return e.post("/api/books",t)},n.findBookbyIDNum=function(t){return e.get("/api/books/"+t)},n.updateBookByID=function(t,n){return console.log(n),e.put("/api/books/"+t,n)},n["delete"]=function(t){return e["delete"]("/api/books/"+t)},n.findData=function(t,n){var a={params:{field:t,search:n}};return e.get("/api/booksData/",a)},n.getMyBooks=function(t){var n={params:{idNum:t}};return e.get("/api/myBooks/",n)},n.manageMyBook=function(t,n){var a={params:{MongoID:t,idNum:n}};return e.put("/api/myBooks/",a)},n.allBooksTaken=function(t){var n={params:{page:t}};return e.get("/api/booksTaken/",n)},n.setcurrentEditBook=function(e){t=e},n.getcurrentEditBook=function(){return t},n.clearcurrentEditBook=function(){t=null},n}]),angular.module("EventsService",[]).factory("Events",["$http",function(e){var t={};return t.mainCal=function(t,n){var a=new Date,r={params:{key:n,timeMin:a,singleEvents:!0,orderBy:"startTime",maxResults:10}};return e.get("https://www.googleapis.com/calendar/v3/calendars/"+t+"/events",r)},t}]),angular.module("MealService",[]).factory("Meal",["$http",function(e){var t={};return t.all=function(){return e.get("/api/meals/")},t.mine=function(t){return e.get("/api/userMeals/"+t)},t.inDay=function(t){return e.get("/api/meals/"+t)},t.create=function(t){return e.post("/api/meals",t)},t["delete"]=function(t){return e["delete"]("/api/meals/"+t)},t.hasDiet=function(t){return e.get("/api/userDiets/"+t)},t.getUserNumbers=function(){return e.get("/api/allowedMealsNumber/")},t.getCurrentDate=function(){var t="581a49db56fb4a0103b26088";return e.get("/api/lastdate/"+t)},t.updateCurrentDate=function(t){var n={};return n.timestamp=t.getTime(),n.id="581a49db56fb4a0103b26088",e.put("/api/lastdate/",n)},t.addCurrentDate=function(t){var n={};return n.timestamp=t.getTime(),e.post("/api/lastdate/",n)},t}]),angular.module("SettingsService",[]).factory("Settings",["$http",function(e){var t,n={};return n.prepareData=function(){var t={params:{id:"581a49db56fb4a0103b26088"}};return e.get("/api/settings",t)},n.clearCollection=function(t){if("LastDate"==t){var n={};return n.timestamp=new Date("01/01/2000"),n.timestamp=n.timestamp.getTime(),n.id="581a49db56fb4a0103b26088",e.put("/api/lastdate/",n)}var a={params:{chosen:t}};return e["delete"]("/api/settings/",a)},n.all=function(t){var n={params:{page:t}};return e.get("/api/users/",n)},n.create=function(t){return e.post("/api/users",t)},n["delete"]=function(t){return e["delete"]("/api/users/"+t)},n.findUserbyIDNum=function(t){return e.get("/api/users/"+t)},n.updateUserByID=function(t,n){return e.put("/api/users/"+t,n)},n.setcurrentEditUser=function(e){t=e},n.getcurrentEditUser=function(){return t},n.clearcurrentEditUser=function(){t=null},n}]),angular.module("SportsService",[]).factory("Sport",["$http",function(e){var t,n={};return n.all=function(t){return e.get("/api/sports/",t)},n.create=function(t){return e.post("/api/sports",t)},n.findSportbyIDNum=function(t){return e.get("/api/sports/"+t)},n.updateSportByID=function(t,n){return console.log(n),e.put("/api/sports/"+t,n)},n["delete"]=function(t){return e["delete"]("/api/sports/"+t)},n.findData=function(t,n){var a={params:{field:t,search:n}};return e.get("/api/sportsData/",a)},n.setcurrentEditSport=function(e){t=e},n.getcurrentEditSport=function(){return t},n}]);