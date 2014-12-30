// search.js
angular.module('xyz')
  .factory('search', function($http){
    return $http.get('http://localhost:3000/api/media/search/');
  })