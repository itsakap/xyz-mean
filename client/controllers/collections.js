angular.module('xyz')
  .controller("CollectionsCtrl", function($scope, $auth, $window, $rootScope, xyzAPI){
    xyzAPI.getCollections().success(function(collections){
      angular.element(document.querySelector('#nav-container')).removeClass('expanded');
      $scope.collections = collections;
    });
    $scope.createCollection = function(){
      xyzAPI.createCollection({name: $scope.name}).success(function(collections){
        $scope.collections = collections;
      })
    }
    $scope.viewCollection = function(id){
      var mapScope = $scope.$parent;
      mapScope.loaded = false;
      xyzAPI.viewCollection(id).success(function(response){
        mapScope.populateMap(response);

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
    $scope.logout = function(){
      $auth.logout();
      $scope.$parent.showWindow=false;
      delete $window.localStorage;
    }
  });