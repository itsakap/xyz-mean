angular.module('xyz')
  .controller("PostDetailCtrl",function($scope, $modalInstance, currentPost){
    $scope.currentPost = currentPost;
    // console.log($scope.searchOptions);
    $scope.close = function(){
      $modalInstance.close();
    }
  })