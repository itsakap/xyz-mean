// tags.js
angular.module('xyz')
  .controller('TagsCtrl', function($scope, $interval, Tags){
    $scope.conf = {
        news_pos: 200, // the starting position from the right in the news container
        news_move_flag: true // for detecting mouse over
    };
    $scope.init = function() {
      $interval($scope.news_move, 1);
    };
    $scope.get_news_right = function(idx) {
        var $right = $scope.conf.news_pos;
        return $right+'px';
    };
    $scope.news_move = function() {
        if($scope.grandma) {
          $scope.conf.news_pos = 200;
          $scope.$parent.grandma = false;  // total party foul
        }
        if(Object.keys($scope.tags).length > 0 && $scope.conf.news_move_flag) {
          $scope.conf.news_pos--;
        }
    };
  })