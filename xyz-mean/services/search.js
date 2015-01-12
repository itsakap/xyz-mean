// search.js
angular.module('xyz')
  .factory('Search', function($http){
    return {
      go: function(params){
        return $http.get('https://lit-ridge-5274.herokuapp.com/api/media/search/', {params: params});
      }
    };
  })