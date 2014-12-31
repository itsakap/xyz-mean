// map.js
angular.module('xyz')
  .controller('MapCtrl', function($scope, $resource, $modal, $log, searchOptions, Search){
    $scope.posts = [];
    $scope.icon = {
      url: 'images/marker.png',
      // This marker is 20 pixels wide by 32 pixels tall.
      size: new google.maps.Size(20, 32),
      // The origin for this image is 0,0.
      origin: new google.maps.Point(0,0),
      // The anchor for this image is the base of the flagpole at 0,32.
      anchor: new google.maps.Point(0, 32),
      scaledSize: new google.maps.Size(20,20)
    };
    var oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    // $scope.searchOptions=searchOptions;
    $scope.showWindow = false;

    $scope.infoWindow = {
      options: {
        // visible: false,
        boxClass:"infobox-wrapper",
        disableAutoPan: false,
        maxWidth: 200,
        pixelOffset: new google.maps.Size(-140, 0),
        boxStyle: {
          background: "url('http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/examples/tipbox.gif') no-repeat",
          width: "250px"
        },
        zIndex: null,
        closeBoxMargin: "12px 4px 2px 2px",
        closeBoxURL: "images/exit.png",
        infoBoxClearance: new google.maps.Size(1,1)
      },
      closeClick: function(){
        $scope.showWindow = false;
      }
    };
    $scope.map = {
      center: {latitude: 44, longitude:-108},
      zoom:4,
      control: {},
      styles:[
        {"featureType":"water","elementType":"geometry","stylers":[{"color":"#193341"}]},
        {"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#2c5a71"}]},
        {"featureType":"road","elementType":"geometry","stylers":[{"color":"#29768a"},{"lightness":-37}]},
        {"featureType":"poi","elementType":"geometry","stylers":[{"color":"#406d80"}]},
        {"featureType":"transit","elementType":"geometry","stylers":[{"color":"#406d80"}]},
        {"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#3e606f"},{"weight":2},{"gamma":0.84}]},
        {"elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},
        {"featureType":"administrative","elementType":"geometry","stylers":[{"weight":0.6},{"color":"#1a3541"}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#2c5a71"}]}
      ]
    };
    $scope.options = {
      mapTypeControl: false,
      panControl: false,
      streetViewControl: false
    };

    $scope.searchbox = {
      template:'searchbox.tpl.html',
      position:'top-left',
      events:{
        places_changed:function(s){
          var place = s.getPlaces()[0].geometry.location,
              lat = place.lat(),
              lng = place.lng();
          // searchOptions.lat=lat, searchOptions.lng=lng;
          $scope.goForthAndSearch(lat,lng);
        }
      }
    }
    $scope.refresh=function(){
      var lat = $scope.map.center.latitude;
      var lng = $scope.map.center.longitude;
      goForthAndSearch(lat,lng);
    };
    $scope.goForthAndSearch = function(lat, lng){
      var send = {};
      for(option in searchOptions){
        send[option] = searchOptions[option];
      }
      send.lat = lat, send.lng = lng;
      if(send.minTime != undefined) {
        send.minTime -= 0, send.minTime /= 1000;
      }
      if(send.maxTime != undefined) {
        send.maxTime -= 0, send.maxTime /= 1000;
      }
      Search.go(send).success(function(body){
        $scope.posts=[], $scope.showWindow = false;
        $scope.currentPost = {
          post:{
            coords:null,
            mediaLarge:""
          },
          click:function(){
            var modalInstance = $modal.open({
              resolve:{
                currentPost:function(){
                  return $scope.currentPost;
                }
              },
              templateUrl: 'post-detail.html',
              controller: 'PostDetailCtrl',
              windowClass: 'post-detail'
            });
            modalInstance.result.then(function(selectedItem){

            }, function(){
              $log.info('closing');
            })
          }
        };
        $scope.map.center={latitude:lat,longitude:lng};
        $scope.map.zoom = 13;
        body.data.forEach(function(post,index){
          post.click = function(marker,eventName,model){
            if($scope.currentPost.post != model) {
              $scope.currentPost.post = model;
              $scope.currentPost.coords = {latitude: model.latitude, longitude: model.longitude}
            }
            $scope.showWindow = true;
          };
          post.icon = $scope.icon;
        });
        $scope.posts = body.data;
      });
    }
  })