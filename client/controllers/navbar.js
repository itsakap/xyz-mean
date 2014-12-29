// navbar.js
angular.module("xyz")
  .controller('NavbarCtrl', function($scope, $modal, $log){
    $scope.openSettings = function(){
      var modalInstance = $modal.open({
        templateUrl: 'xxx.html',
        controller: 'MapCtrl'
      });
      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

  });