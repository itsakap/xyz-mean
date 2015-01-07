// navbar.js
angular.module("xyz")
  .controller('NavbarCtrl', function($scope, $window, $location, $modal, $rootScope, $auth, searchOptions){
    $scope.isAuthenticated = function(){
      return $auth.isAuthenticated();
    };
    $scope.instagramLogin = function(){
      $auth.authenticate('instagram')
      .then(function(response){
        $window.localStorage.currentUser = JSON.stringify(response.data.user);
        $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
      })
      .catch(function(response){
        console.log(response.data);
        alert('Sign in to access extra features!');
      });
    
    };
    $scope.logout = function(){
      $auth.logout();
      delete $window.localStorage.currentUser;
    };
    $scope.openSettings = function(){
      var modalInstance = $modal.open({
        templateUrl: 'search-options.html',
        controller: 'ModalInstanceCtrl'
      });
      modalInstance.result.then(function (selectedItem) {
      }, function () {
      });
    };
  })
  .controller('ModalInstanceCtrl', function($scope, $modalInstance, searchOptions){
    $scope.searchOptions = searchOptions;
    $scope.close = function(){
      searchOptions = $scope.searchOptions;
      $modalInstance.close();
    }
  })