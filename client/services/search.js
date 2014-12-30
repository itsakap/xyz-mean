// search.js
angular.module('xyz')
  .factory('Search', function($http){
    return {
      go: function(params){
        return $http.get('http://localhost:3000/api/media/search/', {params: params});
      }
    };
  })