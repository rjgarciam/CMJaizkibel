angular.module('settingsCtrl', ['ngMaterial',])

.controller('SettingsController', function($rootScope, $location, Settings,$window,$mdDialog, $q, Meal, Book) {
  var vm = this;

  vm.settingsData = {
    lastMealsDate: new Date(),
    mealsInDB: 0,
    usersInDB: 0,
    booksInDB: 0,
    matchesInDB: 0,
  }

  vm.user = {
    name: '',
    email: '',
    number: '',
    admin: false,
    meals: false,
    lockMeals: false,
    library: false,
    hasDiet: false,
    dietContent: '',
  };

  vm.currentPage = 1;
  vm.numPages;
  vm.sendButtonText = 'Enviar';
  vm.isUpdate = false;
  vm.processing = false;
  vm.errors = false;
  vm.newUsersNumber = 0;
  vm.uploadDone = false;

  vm.gotoUsersList = function(){
    $location.path('/usersList');
  }

  vm.gotoAddUser = function(){
    $location.path('/addUser');
  }

  vm.clearAll = function(collection){
    Settings.clearCollection(collection).then(function(data){
      vm.loadSettingsData();
    });
  }

  vm.loadSettingsData = function(){
    Settings.prepareData().success(function(data){
      vm.settingsData = data;
    });
  };

  if(Settings.getcurrentEditUser()){
    Settings.findUserbyIDNum(Settings.getcurrentEditUser()).then(function(data){
      vm.user = data.data;
    });
    vm.isUpdate = true;
    vm.sendButtonText = 'Actualizar';
  }

  vm.dateBack = function(collection){
    vm.processing = true;
    vm.message = '';
    date = new Date(new Date().setDate(new Date().getDate()));
    date.setHours(0,0,0,0);
    Meal.updateCurrentDate(date)
      .success(function(data) {
        vm.processing = false;
        vm.loadSettingsData();
      });
  }

  vm.openDial = function(execFunction, collection, event) {
    var confirm = $mdDialog.confirm()
          .title('¿Estás seguro?')
          .textContent('Esta acción no se podrá deshacer.')
          .ariaLabel('Confirmar')
          .ok('Continuar')
          .cancel('Cancelar')
          .targetEvent(event);
    $mdDialog.show(confirm).then(function() {
      execFunction(collection);
    });
  };

  vm.getUsers = function() {
    Settings.all(vm.currentPage)
      .success(function(data) {
        vm.processing = false;
        vm.users = data.users;
        vm.numPages = data.nump;
      });
  }

  vm.nextPressed = function(){
    ++vm.currentPage;
    vm.getUsers();
  }

  vm.prevPressed = function(){
    --vm.currentPage;
    vm.getUsers();
  }

  vm.deleteUser = function(id){
    vm.processing = true;
    Settings.delete(id)
      .success(function(data){
        vm.processing = false;
        vm.users = data;
        $location.path("/usersList");
      });
  }

  vm.isChecked = function(item){
    return vm.user[item];
  }
  vm.toggle = function(item){
    vm.user[item] = !vm.user[item];
    return vm.user[item];
  }

  vm.addNewUser = function(){
    Settings.create(vm.user).success(function(data){
      vm.sendButtonText = 'Enviado';
      $location.path("/usersList");
    });
  }

  vm.addUser = function(){
    Settings.clearcurrentEditUser();
    $location.path("/addUser");
  }

  vm.editUser = function(user_id){
    Settings.setcurrentEditUser(user_id);
    $location.path("/addUser");
  }

  vm.editedUser = function(){
    Settings.updateUserByID(vm.user._id,vm.user).success(function(data){
      $location.path("/usersList");
    });
  }

  vm.showUploadUsersDialog = function(ev) {
    console.log("Users dialog");
    $mdDialog.show({
      contentElement: '#uploadUsersDialog',
      parent: angular.element(document.body),
      clickOutsideToClose:false,
      escapeToClose: false,
      fullscreen: false,
    });
  };

  vm.showUploadBooksDialog = function(ev) {
    console.log("Books dialog");
    $mdDialog.show({
      contentElement: '#uploadBooksDialog',
      parent: angular.element(document.body),
      clickOutsideToClose:false,
      escapeToClose: false,
      fullscreen: false,
    });
  };

  vm.hideDial = function(){
    $mdDialog.hide();
    vm.uploadDone = false;
  }



  vm.processCSVUsers = function(event){
    console.log("processing users!");
    var file = event.target.files;
    Papa.parse(file[0], {
      complete: function(results) {
          results.data.splice(0,1);
          vm.newUsersNumber = results.data.length;
          vm.uploadMultipleUsers(results.data);
      }
    });
  }

  vm.processCSVBooks = function(event){
    console.log("processing books!");
    var file = event.target.files;
    Papa.parse(file[0], {
      complete: function(results) {
          results.data.splice(0,1);
          vm.newBooksNumber = results.data.length;
          vm.uploadMultipleBooks(results.data);
      }
    });
  }

  vm.uploadMultipleUsers = function(usersList){
    console.log("Uploading Users!");
    vm.processing = true;
    vm.uploadDone = true;
    Settings.clearCollection('User').then(function(){
      vm.showUploadUsersDialog();
      var promiseArray = [];
      var user = {};
      usersList.map(function(e){
        var i;
        for(i=3;i<7;++i){
          if(e[i]==="no"){
            e[i] = false;
          }else{
            e[i] = true;
          }
        }
        user = {
          name: e[0],
          email: e[1].toLowerCase(),
          number: e[2],
          admin: e[3],
          meals: e[4],
          lockMeals: e[5],
          library: e[6],
        };
        if(e[7] === ""){
          user.hasDiet = false;
        }else{
          user.hasDiet = true;
          user.dietContent = 'dieta'; //e[7];
        }
        promiseArray.push(Settings.create(angular.copy(user)));
      });
      $q.all(promiseArray)
        .then(
          function () {
            vm.processing = false;
            vm.loadSettingsData();
          },
          function () {
            vm.processing = false;
            vm.errors = true;
          }
        );
    });
  }

  vm.uploadMultipleBooks = function(booksList){
    console.log("Uploading Books!");
    vm.processing = true;
    vm.uploadDone = true;
      vm.showUploadBooksDialog();
      var promiseArray = [];
      var book = {};
      booksList.map(function(e){
        book = {
          titulo: e[0],
          fullAuthor: e[1],
          enUso: null,
        };
        promiseArray.push(Book.create(angular.copy(book)));
      });
      $q.all(promiseArray)
        .then(
          function () {
            vm.processing = false;
            vm.loadSettingsData();
          },
          function () {
            vm.processing = false;
            vm.errors = true;
          }
        );
  }

});