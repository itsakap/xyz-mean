// navbar.js
angular.module("xyz")
  .controller('NavbarCtrl', function($scope, $modal, searchOptions){
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