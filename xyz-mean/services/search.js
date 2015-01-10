// search.js
angular.module('xyz')
  .factory('Search', function($http){
    return {
      go: function(params){
        return $http.get('https://frozen-chamber-6676.herokuapp.com/api/media/search/', {params: params});
      }
    };
  })