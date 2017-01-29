angular.module('BookService', [])

.factory('Book', function($http) {

  // create a new object
  var BookFactory = {};
  var savedBook;

  // get all books
  BookFactory.all = function(name,current){
    var config = { params:{
                    search: name,
                    page:current
                  }};
    return $http.get('/api/books/' ,config);
  };

  // add a book
  BookFactory.create = function(BookData) {
    return $http.post('/api/books', BookData);
  };

  // find a book by ID Number
  BookFactory.findBookbyIDNum = function(id) {
    return $http.get('/api/books/' + id);
  };

  // find a book by ID Number
  BookFactory.updateBookByID = function(id, BookData) {
    console.log(BookData);
    return $http.put('/api/books/' + id, BookData);
  };

  // delete a book
  BookFactory.delete = function(id) {
    return $http.delete('/api/books/' + id);
  };

  // find book data
  BookFactory.findData = function(dataField,searchText) {
    var config = { params:{
                field: dataField,
                search:searchText
              }};
    return $http.get('/api/booksData/',config);
  };

  BookFactory.getMyBooks = function(userNumber) {
    var config = { params:{
                idNum: userNumber,
              }};
    return $http.get('/api/myBooks/',config);
  };

  BookFactory.manageMyBook = function(bookID,userNumber) {
    var config = { params:{
                MongoID: bookID,
                idNum: userNumber,
              }};
    return $http.put('/api/myBooks/', config);
  };

  BookFactory.allBooksTaken = function(current) {
    var config = { params:{
                    page: current
                  }};
    return $http.get('/api/booksTaken/' ,config);
  };

  BookFactory.setcurrentEditBook = function(book){
    savedBook = book;
  }

  BookFactory.getcurrentEditBook = function(){
    return savedBook;
  }

  BookFactory.clearcurrentEditBook = function(){
    savedBook = null;
  }
  
  return BookFactory;

});