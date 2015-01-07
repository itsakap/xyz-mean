angular.module('xyz')
  .controller("CollectionsCtrl", function($scope, xyzAPI){
    xyzAPI.getCollections().success(function(collections){
      $scope.collections = collections;
      });
    $scope.createCollection = function(){
      xyzAPI.createCollection({name: $scope.name}).success(function(collections){
        $scope.collections = collections;
      })
    }
    $scope.editCollection = function(id, name){
      xyzAPI.editCollection(id, name).success(function(updatedColl){
        // xeditable is doing most of the callback work
      });
    }
    $scope.deleteCollection = function(id){
      xyzAPI.deleteCollection(id).success(function(collections){
        $scope.collections = collections;
      });
    }
  });