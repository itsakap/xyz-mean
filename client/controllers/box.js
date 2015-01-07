// box.js
angular.module('xyz')
  .controller('boxCtrl', function($scope, $auth, xyzAPI){

    $scope.isAuthenticated = function(){
      return $auth.isAuthenticated();
    };
    $scope.like = function(){
      // console.log($scope.$parent.parameter);
      $scope.hasLiked = true;
      var id = $scope.$parent.parameter.post.idKey;
      xyzAPI.likeMedia(id).error(function(data){
        console.log(data);
      })
    };
  })