// box.js
angular.module('xyz')
  .controller('boxCtrl', function($scope, $auth, xyzAPI){
    // $scope.hasLiked = $scope.$parent.parameter.post.liked;
    
    $scope.isAuthenticated = function(){
      return $auth.isAuthenticated();
    };
    $scope.like = function(){
      // console.log($scope.$parent.parameter);
      $scope.$parent.parameter.post.liked = true;
      var id = $scope.$parent.parameter.post.idKey;
      xyzAPI.likeMedia(id).error(function(data){
        console.log(data);
      })
    };
  })