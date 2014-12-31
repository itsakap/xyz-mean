// navbar.js
angular.module("xyz")
  .controller('NavbarCtrl', function($scope, $modal, $log, searchOptions){
    $scope.openSettings = function(){
      var modalInstance = $modal.open({
        templateUrl: 'search-options.html',
        controller: 'ModalInstanceCtrl'
      });
      modalInstance.result.then(function (selectedItem) {
      }, function () {
        $log.info("closing");
      });
    };
  })
  .controller('ModalInstanceCtrl', function($scope, $modalInstance, searchOptions){
    $scope.searchOptions = searchOptions;
    console.log($scope.searchOptions);
    $scope.close = function(){
      searchOptions = $scope.searchOptions;
      $modalInstance.close();
    }
  })