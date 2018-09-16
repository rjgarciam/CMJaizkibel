angular.module("cmgoimendi",["ngAnimate","ngMessages","app.routes","AuthService","mainCtrl","ngMaterial","angular-jwt","mealCtrl","MealService","settingsCtrl","SettingsService","bookCtrl","BookService","angular.filter","eventsCtrl","EventsService","sportsCtrl","SportsService"]).config(["$mdThemingProvider",function(e){e.theme("default").primaryPalette("indigo",{"default":"700","hue-1":"800","hue-2":"900"}).accentPalette("grey",{"default":"500"})}]).config(["$httpProvider","$mdDateLocaleProvider",function(e,t){e.interceptors.push("authInterceptor"),t.formatDate=function(e){return e?moment(e).format("DD-MM-YYYY"):""},t.parseDate=function(e){var t=moment(e,"DD-MM-YYYY",!0);return t.isValid()?t.toDate():new Date(NaN)},t.firstDayOfWeek=1}]).run(["$rootScope","$location",function(e,t){e.$on("$routeChangeStart",function(n,a,r){var o=a.data.reqPermissions,s=a.data.redirect;"/offline"!=a.originalPath?"/login"!=a.originalPath&&1!=e.userData[o]?(n.preventDefault(),t.path(s)):"/login"==a.originalPath&&1==e.userData[o]&&(n.preventDefault(),t.path(s)):e.userData.isLogged=!1})}]).run(["$window","$rootScope","$location",function(e,t,n){t.online=navigator.onLine,e.addEventListener("offline",function(){t.$apply(function(){t.online=!1,n.path("/offline")})},!1),e.addEventListener("online",function(){t.$apply(function(){t.online=!0,n.path("/meals")})},!1)}]).directive("ngModel",["$filter",function(e){return{require:"?ngModel",link:function(e,t,n,a){a&&"Time"===n.type&&a.$formatters.unshift(function(e){return e.replace(/:[0-9]{2}\.[0-9]{3}$/,"")})}}}]).directive("customOnChange",function(){return{restrict:"A",link:function(e,t,n){var a=e.$eval(n.customOnChange);t.bind("change",a)}}}),angular.module("app.routes",["ngRoute"]).config(["$routeProvider","$locationProvider",function(e,t){e.when("/meals",{templateUrl:"app/views/pages/meals.html",controller:"MealController",controllerAs:"meals",data:{reqPermissions:"isLogged",redirect:"/login"}}).when("/mealrequests",{templateUrl:"app/views/pages/mealRequests.html",controller:"MealController",controllerAs:"meals",data:{reqPermissions:"meals",redirect:"/meals"}}).when("/login",{templateUrl:"app/views/pages/login.html",controller:"MainController",controllerAs:"login",data:{reqPermissions:"isLogged",redirect:"/meals"}}).when("/settings",{templateUrl:"app/views/pages/settings.html",controller:"SettingsController",controllerAs:"settings",data:{reqPermissions:"admin",redirect:"/meals"}}).when("/addUser",{templateUrl:"app/views/pages/newUser.html",controller:"SettingsController",controllerAs:"settings",data:{reqPermissions:"admin",redirect:"/meals"}}).when("/usersList",{templateUrl:"app/views/pages/usersList.html",controller:"SettingsController",controllerAs:"settings",data:{reqPermissions:"admin",redirect:"/meals"}}).when("/books",{templateUrl:"app/views/pages/books.html",controller:"BooksController",controllerAs:"books",data:{reqPermissions:"isLogged",redirect:"/login"}}).when("/addBook",{templateUrl:"app/views/pages/newBook.html",controller:"BooksController",controllerAs:"books",data:{reqPermissions:"library",redirect:"/books"}}).when("/myBooks",{templateUrl:"app/views/pages/myBooks.html",controller:"BooksController",controllerAs:"books",data:{reqPermissions:"isLogged",redirect:"/login"}}).when("/booksTaken",{templateUrl:"app/views/pages/booksTaken.html",controller:"BooksController",controllerAs:"books",data:{reqPermissions:"library",redirect:"/books"}}).when("/events",{templateUrl:"app/views/pages/events.html",controller:"EventsController",controllerAs:"events",data:{reqPermissions:"isLogged",redirect:"/login"}}).when("/sports",{templateUrl:"app/views/pages/sports.html",controller:"SportsController",controllerAs:"sports",data:{reqPermissions:"isLogged",redirect:"/login"}}).when("/addSport",{templateUrl:"app/views/pages/newSport.html",controller:"SportsController",controllerAs:"sports",data:{reqPermissions:"isLogged",redirect:"/login"}}).when("/offline",{templateUrl:"app/views/pages/offline.html",controller:"MainController",controllerAs:"login",data:{reqPermissions:"isLogged",redirect:"/offline"}}).when("/cs18",{templateUrl:"app/views/pages/cs18.html",controller:"MealController",controllerAs:"meals",data:{reqPermissions:"isLogged",redirect:"/login"}}).otherwise({redirectTo:"/meals"}),t.html5Mode(!0)}]),angular.module("bookCtrl",["ngMaterial"]).controller("BooksController",["Book","$rootScope","$location",function(e,t,n){var a=this;a.currentPage=1,a.numPages,a.isUpdate=!1,a.sendButtonText="Enviar",a.searchAll="",a.search={apellidos:[""],nombre:[""],titulo:[""],idioma:[""],lugar:[""]},a.book={numero:"",letra:"",apellidos:"",nombre:"",titulo:"",idioma:"",lugar:"",enUso:"",fecha:""},e.getcurrentEditBook()&&(e.findBookbyIDNum(e.getcurrentEditBook()).then(function(e){a.book=e.data}),a.isUpdate=!0,a.sendButtonText="Actualizar"),a.getBooks=function(){e.all(a.searchAll,a.currentPage).success(function(e){a.processing=!1,a.books=e.books,a.numPages=e.nump})},a.deleteBook=function(t){a.processing=!0,e["delete"](t).success(function(e){a.processing=!1,n.path("/books")})},a.addNew=function(){e.create(a.book).success(function(){n.path("/books")}).error(function(){a.sendButtonText="Error"})},a.editedBook=function(){e.updateBookByID(a.book._id,a.book).success(function(){n.path("/books")}).error(function(){a.sendButtonText="Error"})},a.nextPressed=function(){++a.currentPage,a.getBooks()},a.prevPressed=function(){--a.currentPage,a.getBooks()},a.bookData=function(t,n){return e.findData(t,n).then(function(e){return a.processing=!1,e.data})},a.newData=function(e,t){a.book[t]=e},a.selectedItemChange=function(e,t){a.book[t]=e},a.getUserBooks=function(){e.getMyBooks(t.userData.number).success(function(e){a.processing=!1,a.myBooks=e})},a.takeBook=function(n){e.manageMyBook(n,t.userData.number).success(function(e){a.processing=!1,a.getBooks()})},a.returnBook=function(t){e.manageMyBook(t,null).success(function(e){a.processing=!1,a.getUserBooks()})},a.getBooksTaken=function(){e.allBooksTaken(a.currentPage).success(function(e){a.processing=!1,a.books=e.books,a.numPages=e.nump})},a.addBook=function(){e.clearcurrentEditBook(),n.path("/addBook")},a.editBook=function(t){e.setcurrentEditBook(t),n.path("/addBook")}}]),angular.module("eventsCtrl",["ngMaterial"]).controller("EventsController",["$rootScope","Events",function(e,t){var n=this;n.monthNames=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],n.pageToken,n.list=[],n.getEvents=function(){return t.mainCal(n.pageToken).then(function(e){var t=angular.fromJson(e.data);n.pageToken=t.nextPageToken,t.items.map(function(e){e=prepareDates(e)}),Array.prototype.push.apply(n.list,t.items)})},prepareDates=function(e){return e.start.dateTime?e.start.dateTime=new Date(e.start.dateTime):e.start.dateTime=new Date(e.start.date),e.end.dateTime?e.end.dateTime=new Date(e.end.dateTime):e.end.dateTime=new Date(e.end.date),e.end.dateTime.getDate()==e.start.dateTime.getDate()+1?e.start.wholeDay=!0:e.start.wholeDay=!1,e.start.wholeDay||e.end.dateTime.getDay()==e.start.dateTime.getDay()?e.start.manyDays=!1:e.start.manyDays=!0,e}}]),angular.module("mainCtrl",["ngMaterial"]).controller("MainController",["$rootScope","$location","Auth","$window","$scope",function(e,t,n,a,r){var o=this;o.errorLogIn=!1,r.currentNavItem=t.path(),o.checkErrors=function(){"error"==t.hash()&&(o.errorLogIn=!0)},o.goLogIn=function(){a.location.href="/api/auth/google"},e.userData=n,o.logOut=function(){n.logOut(),a.location.href="/login"}}]),angular.module("mealCtrl",[]).controller("MealController",["$rootScope","Meal","$timeout","$mdDialog","$mdMedia","$q","$window",function(e,t,n,a,r,o,s){var i=this;i.pickDate=new Date,i.repeat=!1,i.endDate=new Date,i.currentDate=new Date,i.maxFormDate=new Date(i.currentDate.getTime()+1296e6),i.numberOfBreakfasts=0,i.numberOfLunches=0,i.numberOfDinners=0,i.possibleRepeats=[{id:1,name:"Cada día"},{id:7,name:"Cada semana"}],i.screenSize=s.innerWidth,s.onresize=function(e){n(function(){i.screenSize=s.innerWidth})},i.possibleRequests=["Como a las 13:00","Como","Como a las 15:15","Ceno","Ceno a las 22:00","Desayuno","Desayuno 7:15","Bocadillos a las 11:30","Bocadillos en desayuno a las 7:15","Bocadillos en desayuno a las 8:15","Invitar a comer a las 13:00","Invitar a comer","Invitar a comer a las 15:15","Invitar a cenar"],i.dayBeforeIDkeys=[5,6,8,9],i.breakfastRequests=[5,6],i.lunchRequests=[0,1,2,7,8,9],i.dinnerRequests=[3,4],i.inviteRequests=[10,11,12,13],i.checkInvites=function(e){return i.inviteRequests.indexOf(Number(e))!==-1},i.selectedRequest=2,i.mealAsked={},i.mealAsked.id=e.userData.number,i.mealAsked.date=new Date,i.mealAsked.reqDate=new Date,i.mealAsked.doRepeat=0,i.mealAsked.hasDiet=e.userData.hasDiet,i.mealAsked.dietContent=e.userData.dietContent,i.mealAsked.name=e.userData.name,i.mealButtontext="Enviar",i.askMeal=function(){if(i.processing=!0,i.mealButtontext="",i.verifyMeal())if(i.repeat){i.pushArray=!0;for(var e=[];i.mealAsked.date<=i.mealAsked.endDate&&e.length<15;)e.push(t.create(angular.copy(i.mealAsked))),i.mealAsked.date=new Date(i.mealAsked.date.setDate(i.mealAsked.date.getDate()+Number(i.mealAsked.doRepeat))),i.mealAsked.reqDate=new Date(i.mealAsked.reqDate.setDate(i.mealAsked.reqDate.getDate()+Number(i.mealAsked.doRepeat))),i.verifyMeal()||(i.pushArray=!1);i.pushArray||o.all(e).then(function(){i.processing=!1,i.mealButtontext="Enviado",i.myMeals()},function(){i.processing=!1,i.mealButtontext="Error",i.mealError=!0})}else t.create(i.mealAsked).then(function(){i.processing=!1,i.mealButtontext="Enviado",i.myMeals()},function(){i.processing=!1,i.mealButtontext="Error",i.mealError=!0});else i.mealButtontext="Error",i.mealError=!0;n(function(){i.mealButtontext="Enviar",i.mealError=!1},3e3)},i.verifyMeal=function(){if(console.log(i.mealAsked),i.mealAsked.date.setHours(0,0,0,0),i.mealAsked.reqDate=angular.copy(i.mealAsked.date),i.dayBeforeIDkeys.indexOf(i.mealAsked.change)!==-1&&(i.mealAsked.reqDate=new Date(i.mealAsked.reqDate.setDate(i.mealAsked.reqDate.getDate()-1))),!i.mealAsked.change&&0!=i.mealAsked.change||!i.mealAsked.date)return!1;if(i.mealAsked.reqDate<i.currentDate)return!1;if(i.repeat){if(i.mealAsked.reqDate>=i.mealAsked.endDate)return!1;if(i.mealAsked.endDate<i.currentDate)return!1}return i.addMealMoment(i.mealAsked),console.log(i.mealAsked),!0},i.addMealMoment=function(e){i.breakfastRequests.indexOf(e.change)!==-1?e.moment=0:i.lunchRequests.indexOf(e.change)!==-1?e.moment=1:i.dinnerRequests.indexOf(e.change)!==-1?e.moment=2:10===e.change||11===e.change||12===e.change?e.moment=3:13===e.change&&(e.moment=4)},i.myMeals=function(){t.mine(e.userData.number).success(function(e){i.processing=!1,e.map(function(e){e.date=new Date(e.date),e.reqDate=new Date(e.reqDate)}),i.myRequests=e})},i.getMeals=function(e){i.requests=[],i.numberOfBreakfasts=0,i.numberOfLunches=0,i.numberOfDinners=0;new Date(e.getTime()-864e5);t.inDay(e).success(function(e){e.map(function(e){1==e.change?++i.numberOfLunches:3==e.change?++i.numberOfDinners:5==e.change?++i.numberOfBreakfasts:11==e.change?i.numberOfLunches=i.numberOfLunches+e.numInvites:13==e.change&&(i.numberOfDinners=i.numberOfDinners+e.numInvites),i.requests.push(e)})})},i.deleteRequest=function(e){i.processing=!0,t["delete"](e).success(function(e){i.myMeals()})},i.checkDiets=function(e){t.hasDiet(e.id).success(function(t){if(t[0]&&t[0].hasDiet)return e.dietMeal=t[0].dietContent})},i.allUserNumbers=function(){t.getUserNumbers().success(function(e){i.userNumbersArray=e})},i.getLastDay=function(){t.getCurrentDate().success(function(e){i.currentDate=new Date(e[0].date)})},i.NewDate=function(){i.processing=!0,i.message="",date=new Date((new Date).setDate((new Date).getDate()+1)),date.setHours(0,0,0,0),t.updateCurrentDate(date).success(function(e){i.processing=!1,i.currentDate=date})},i.confirmDate=function(e){var t=a.confirm().title("¿Estás seguro?").textContent("Se cerrará el parte de comidas para hoy.").ariaLabel("Confirmar").ok("Continuar").cancel("Cancelar").targetEvent(e);a.show(t).then(function(){i.NewDate()})}}]),angular.module("settingsCtrl",["ngMaterial"]).controller("SettingsController",["$rootScope","$location","Settings","$window","$mdDialog","$q","Meal",function(e,t,n,a,r,o,s){var i=this;i.settingsData={lastMealsDate:new Date,mealsInDB:0,usersInDB:0,booksInDB:0,matchesInDB:0},i.user={name:"",email:"",number:"",admin:!1,meals:!1,lockMeals:!1,hasDiet:!1},i.currentPage=1,i.numPages,i.sendButtonText="Enviar",i.isUpdate=!1,i.processing=!1,i.errors=!1,i.newUsersNumber=0,i.uploadDone=!1,i.gotoUsersList=function(){t.path("/usersList")},i.gotoAddUser=function(){t.path("/addUser")},i.clearAll=function(e){n.clearCollection(e).then(function(e){i.loadSettingsData()})},i.loadSettingsData=function(){n.prepareData().success(function(e){i.settingsData=e})},n.getcurrentEditUser()&&(n.findUserbyIDNum(n.getcurrentEditUser()).then(function(e){i.user=e.data}),i.isUpdate=!0,i.sendButtonText="Actualizar"),i.dateBack=function(e){i.processing=!0,i.message="",date=new Date((new Date).setDate((new Date).getDate())),date.setHours(0,0,0,0),s.updateCurrentDate(date).success(function(e){i.processing=!1,i.loadSettingsData()})},i.openDial=function(e,t,n){var a=r.confirm().title("¿Estás seguro?").textContent("Esta acción no se podrá deshacer.").ariaLabel("Confirmar").ok("Continuar").cancel("Cancelar").targetEvent(n);r.show(a).then(function(){e(t)})},i.getUsers=function(){n.all(i.currentPage).success(function(e){i.processing=!1,i.users=e.users,i.numPages=e.nump})},i.nextPressed=function(){++i.currentPage,i.getUsers()},i.prevPressed=function(){--i.currentPage,i.getUsers()},i.deleteUser=function(e){i.processing=!0,n["delete"](e).success(function(e){i.processing=!1,i.users=e,t.path("/usersList")})},i.isChecked=function(e){return i.user[e]},i.toggle=function(e){return i.user[e]=!i.user[e],i.user[e]},i.addNewUser=function(){n.create(i.user).success(function(e){i.sendButtonText="Enviado",t.path("/usersList")})},i.addUser=function(){n.clearcurrentEditUser(),t.path("/addUser")},i.editUser=function(e){n.setcurrentEditUser(e),t.path("/addUser")},i.editedUser=function(){n.updateUserByID(i.user._id,i.user).success(function(e){t.path("/usersList")})},i.showUploadFileDialog=function(e){r.show({contentElement:"#uploadFileDialog",parent:angular.element(document.body),clickOutsideToClose:!1,escapeToClose:!1,fullscreen:!1})},i.hideDial=function(){r.hide(),i.uploadDone=!1},i.processCSV=function(e){var t=e.target.files;Papa.parse(t[0],{complete:function(e){e.data.splice(0,1),i.newUsersNumber=e.data.length,i.uploadMultipleUsers(e.data)}})},i.uploadMultipleUsers=function(e){i.processing=!0,i.uploadDone=!0,n.clearCollection("User").then(function(){i.showUploadFileDialog();var t=[],a={};e.map(function(e){var r;for(r=3;r<6;++r)"no"===e[r]?e[r]=!1:e[r]=!0;a={name:e[0],email:e[1].toLowerCase(),number:e[2],admin:e[3],meals:e[4],lockMeals:e[5]},""===e[6]?a.hasDiet=!1:a.hasDiet=!0,t.push(n.create(angular.copy(a)))}),o.all(t).then(function(){i.processing=!1,i.loadSettingsData()},function(){i.processing=!1,i.errors=!0})})}}]),angular.module("sportsCtrl",["ngMaterial"]).controller("SportsController",["Sport","$location",function(e,t){var n=this;n.isUpdate=!1,n.search="",n.sendButtonText="Enviar",n.numPages,n.matches,n.currentPage=1,n.match={name:"",place:"",playersPerTeam:1,numberOfTeams:2,date:new Date,startTime:new Date,endTime:new Date,isLocked:!1,playersList:{},waitingList:!1},e.getcurrentEditSport()&&(e.findSportbyIDNum(e.getcurrentEditSport()).then(function(e){e.data.playersList=e.data.playersList[0],e.data.date=new Date(e.data.date),e.data.startTime=new Date(e.data.startTime),e.data.endTime=new Date(e.data.endTime),n.match=e.data}),n.isUpdate=!0,n.sendButtonText="Actualizar"),n.getSports=function(){e.all(n.currentPage).success(function(e){n.processing=!1,n.matches=e.matches,n.numPages=e.nump})},n.getNumber=function(e){return new Array(e)},n.editedMatch=function(){console.log(typeof n.match.playersList),console.log(n.match)},n.addMatch=function(){e.create(n.match).success(function(e){t.path("/sports")})},n.deleteMatch=function(a){n.processing=!0,e["delete"](a).success(function(e){n.processing=!1,t.path("/sports")})},n.matchData=function(t,a){return e.findData(t,a).then(function(e){return n.processing=!1,e.data})},n.selectedItemChange=function(e,t){n.match.place=e},n.newData=function(e,t){n.match.place=e},n.nextPressed=function(){++n.currentPage,n.getSports()},n.prevPressed=function(){--n.currentPage,n.getSports()},n.editedMatch=function(){e.updateSportByID(n.match._id,n.match).success(function(e){t.path("/sports")})},n.editMatch=function(n){e.setcurrentEditSport(n),t.path("/addSport")},n.playersNum=function(e){var t=0,n=0;for(n=0;n<e.numberOfTeams;++n)e.playersList[0]&&e.playersList[0][n]&&(t+=Object.keys(e.playersList[0][n]).length);return t}}]),angular.module("AuthService",["ngCookies","angular-jwt"]).factory("Auth",["$http","$q","$cookies","jwtHelper",function(e,t,n,a){var r={isLogged:!1,email:"",meals:!1,library:!1,admin:!1,number:0,hasDiet:!1,dietContent:"dieta",name:""},o=n.get("cmgoimendi");if(o){var s=a.decodeToken(o);s&&!a.isTokenExpired(o)&&(r.number=s.number,r.isLogged=s.isLogged,r.email=s.email,r.meals=s.meals,r.lockMeals=s.lockMeals,r.admin=s.admin,r.hasDiet=s.hasDiet,r.name=s.name)}return r.logOut=function(){n.remove("cmgoimendi")},r}]).factory("authInterceptor",["$rootScope","$q","$cookies",function(e,t,n){return{request:function(e){var t=n.get("cmgoimendi");return e.headers=e.headers||{},t&&(e.headers["x-access-token"]=t),e},response:function(e){return e||t.when(e)}}}]),angular.module("BookService",[]).factory("Book",["$http",function(e){var t,n={};return n.all=function(t,n){var a={params:{search:t,page:n}};return e.get("/api/books/",a)},n.create=function(t){return e.post("/api/books",t)},n.findBookbyIDNum=function(t){return e.get("/api/books/"+t)},n.updateBookByID=function(t,n){return console.log(n),e.put("/api/books/"+t,n)},n["delete"]=function(t){return e["delete"]("/api/books/"+t)},n.findData=function(t,n){var a={params:{field:t,search:n}};return e.get("/api/booksData/",a)},n.getMyBooks=function(t){var n={params:{idNum:t}};return e.get("/api/myBooks/",n)},n.manageMyBook=function(t,n){var a={params:{MongoID:t,idNum:n}};return e.put("/api/myBooks/",a)},n.allBooksTaken=function(t){var n={params:{page:t}};return e.get("/api/booksTaken/",n)},n.setcurrentEditBook=function(e){t=e},n.getcurrentEditBook=function(){return t},n.clearcurrentEditBook=function(){t=null},n}]),angular.module("EventsService",[]).factory("Events",["$http",function(e){var t={};return t.mainCal=function(t){var n=new Date,a={params:{minTime:n,pageToken:t}};return e.get("/api/events/",a)},t}]),angular.module("MealService",[]).factory("Meal",["$http",function(e){var t={};return t.all=function(){return e.get("/api/meals/")},t.mine=function(t){return e.get("/api/userMeals/"+t)},t.inDay=function(t){return e.get("/api/meals/"+t)},t.create=function(t){return e.post("/api/meals",t)},t["delete"]=function(t){return e["delete"]("/api/meals/"+t)},t.hasDiet=function(t){return e.get("/api/userDiets/"+t)},t.getUserNumbers=function(){return e.get("/api/allowedMealsNumber/")},t.getCurrentDate=function(){var t="581a49db56fb4a0103b26088";return e.get("/api/lastdate/"+t)},t.updateCurrentDate=function(t){var n={};return n.timestamp=t.getTime(),n.id="581a49db56fb4a0103b26088",e.put("/api/lastdate/",n)},t.addCurrentDate=function(t){var n={};return n.timestamp=t.getTime(),e.post("/api/lastdate/",n)},t}]),angular.module("SettingsService",[]).factory("Settings",["$http",function(e){var t,n={};return n.prepareData=function(){var t={params:{id:"581a49db56fb4a0103b26088"}};return e.get("/api/settings",t)},n.clearCollection=function(t){if("LastDate"==t){var n={};return n.timestamp=new Date("01/01/2000"),n.timestamp=n.timestamp.getTime(),n.id="581a49db56fb4a0103b26088",e.put("/api/lastdate/",n)}var a={params:{chosen:t}};return e["delete"]("/api/settings/",a)},n.all=function(t){var n={params:{page:t}};return e.get("/api/users/",n)},n.create=function(t){return e.post("/api/users",t)},n["delete"]=function(t){return e["delete"]("/api/users/"+t)},n.findUserbyIDNum=function(t){return e.get("/api/users/"+t)},n.updateUserByID=function(t,n){return e.put("/api/users/"+t,n)},n.setcurrentEditUser=function(e){t=e},n.getcurrentEditUser=function(){return t},n.clearcurrentEditUser=function(){t=null},n}]),angular.module("SportsService",[]).factory("Sport",["$http",function(e){var t,n={};return n.all=function(t){return e.get("/api/sports/",t)},n.create=function(t){return e.post("/api/sports",t)},n.findSportbyIDNum=function(t){return e.get("/api/sports/"+t)},n.updateSportByID=function(t,n){return console.log(n),e.put("/api/sports/"+t,n)},n["delete"]=function(t){return e["delete"]("/api/sports/"+t)},n.findData=function(t,n){var a={params:{field:t,search:n}};return e.get("/api/sportsData/",a)},n.setcurrentEditSport=function(e){t=e},n.getcurrentEditSport=function(){return t},n}]);