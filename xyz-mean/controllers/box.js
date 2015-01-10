// box.js
angular.module('xyz')
  .controller('boxCtrl', function($scope, $auth, xyzAPI, editableOptions, editableThemes){
    $scope.post = {collection: ''};
    $scope.getCollections= function(){
      xyzAPI.getCollections().success(function(collections){
        $scope.collections = collections;
      });
    }
    $scope.addToCollection=function(id){
      var post = $scope.$parent.parameter.post;
      xyzAPI.addToCollection(id, post.idKey).success(function(collection){
        alert('added post to ' + collection.name);
      });
    }
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