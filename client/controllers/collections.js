angular.module('xyz')
  .controller("CollectionsCtrl", function($scope, xyzAPI){
    xyzAPI.getCollections().success(function(collections){
      $scope.collections = collections;
      });
    $scope.createCollection = function(){
      xyzAPI.createCollection({name: $scope.name}).error(function(data){
        console.log(data);
      })
    }
    $scope.editCollection = function(id, name, coll){
      xyzAPI.editCollection(id, name).success(function(updatedColl){
        coll.name = updatedColl.name;
      })
    }
  });