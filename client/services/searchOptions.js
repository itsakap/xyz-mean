// searchOptions.js
angular.module("xyz")
  .factory('searchOptions', function(){
    var oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return {
      minTime: oneWeekAgo
    }
  })