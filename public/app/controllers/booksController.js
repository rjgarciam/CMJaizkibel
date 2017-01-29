angular.module('bookCtrl', ['ngMaterial'])

.controller('BooksController', function(Book,$rootScope,$location) {
  var vm = this;

  vm.currentPage = 1;
  vm.numPages;
  vm.isUpdate = false;
  vm.sendButtonText = 'Enviar';
  vm.searchAll = '';
  vm.search = {
    apellidos: [''],
    nombre: [''],
    titulo: [''],
    idioma: [''],
    lugar: ['']
  };

  vm.book = {
    numero: '',
    letra: '',
    apellidos: '',
    nombre: '',
    titulo: '',
    idioma: '',
    lugar: '',
    enUso: '',
    fecha: '',
  };

  if(Book.getcurrentEditBook()){
    Book.findBookbyIDNum(Book.getcurrentEditBook()).then(function(data){
      vm.book = data.data;
    });
    vm.isUpdate = true;
    vm.sendButtonText = 'Actualizar';
  }

  vm.getBooks = function() {
    Book.all(vm.searchAll,vm.currentPage)
      .success(function(data) {
        vm.processing = false;
        vm.books = data.books;
        vm.numPages = data.nump;
      });
  }

  vm.deleteBook = function(id){
    vm.processing = true;
    Book.delete(id)
      .success(function(data){
        vm.processing = false;
        $location.path("/books");
      });
  }
  
  vm.addNew = function(){
    Book.create(vm.book)
      .success(function(){
        $location.path("/books");
      })
      .error(function(){
        vm.sendButtonText = 'Error';
      });
  }

  vm.editedBook = function(){
    Book.updateBookByID(vm.book._id,vm.book)
      .success(function(){
        $location.path("/books");
      })
      .error(function(){
        vm.sendButtonText = 'Error';
      });
  }

  vm.nextPressed = function(){
    ++vm.currentPage;
    vm.getBooks();
  }

  vm.prevPressed = function(){
    --vm.currentPage;
    vm.getBooks();
  }

  vm.bookData = function(dataField,searchText) {
    return Book.findData(dataField,searchText)
      .then(function(data) {
        vm.processing = false;
        return data.data;
      });
  }

  vm.newData = function(data,field){
    vm.book[field] = data;
  }

  vm.selectedItemChange = function(data,field){
    vm.book[field] = data;
  }

  vm.getUserBooks = function(){
    Book.getMyBooks($rootScope.userData.number)
      .success(function(data) {
        vm.processing = false;
        vm.myBooks = data;
      });
  }

  vm.takeBook = function(id){
    Book.manageMyBook(id,$rootScope.userData.number)
      .success(function(data) {
        vm.processing = false;
        vm.getBooks();
      });
  }

  vm.returnBook = function(id){
    Book.manageMyBook(id,null)
      .success(function(data) {
        vm.processing = false;
        vm.getUserBooks();
      });
  }

  vm.getBooksTaken = function() {
    Book.allBooksTaken(vm.currentPage)
      .success(function(data) {
        vm.processing = false;
        vm.books = data.books;
        vm.numPages = data.nump;
    });
  }

  vm.addBook = function(){
    Book.clearcurrentEditBook();
    $location.path("/addBook");
  }

  vm.editBook = function(book_id){
    Book.setcurrentEditBook(book_id);
    $location.path("/addBook");
  }

});