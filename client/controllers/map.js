// map.js
// THIS FILE IS WAY TOO BIG
angular.module('xyz')
  .controller('MapCtrl', function($scope, $modal, $log, $auth, searchOptions, Search, Posts, Tags){
    $scope.posts = Posts;
    $scope.tags = Tags;
    $scope.loaded = true;
    $scope.grandma = true;
    $scope.isAuthenticated = function(){
      return $auth.isAuthenticated();
    };


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
    $scope.altIcon = {
      url: 'images/altMarker.png',
      // This marker is 20 pixels wide by 32 pixels tall.
      size: new google.maps.Size(20, 32),
      // The origin for this image is 0,0.
      origin: new google.maps.Point(0,0),
      // The anchor for this image is the base of the flagpole at 0,32.
      anchor: new google.maps.Point(0, 32),
      scaledSize: new google.maps.Size(20,20)
    };
    $scope.showWindow = false;
    $scope.infoWindow = {
      options: {
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
      styles:[  // for that awesome color scheme; available for download at <www.snazzymaps.com>
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
          $scope.goForthAndSearch(lat,lng);
        }
      }
    }
    $scope.goForthAndSearch = function(lat, lng){
      $scope.loaded = false;
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
        $scope.map.center={latitude:lat,longitude:lng};
        $scope.populateMap(body);
      });
    };
    $scope.populateMap = function(body){
        if($scope.loaded) { $scope.loaded = false }
        if(Object.keys(body.data).length == 0){alert('No results found. Try searching a more populated or more specific area.');}
        else{
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
                $log.info();
              })
            }
          };
          // $scope.map.zoom = 12;
          var bounds = new google.maps.LatLngBounds();
          for(post in body.data){
            bounds.extend(new google.maps.LatLng(body.data[post].latitude, body.data[post].longitude));
            body.data[post].click = function(marker,eventName,model){
              if($scope.currentPost.post != model) {
                $scope.currentPost.post = model;
                $scope.currentPost.coords = {latitude: model.latitude, longitude: model.longitude}
              }
              $scope.showWindow = true;
            };
            body.data[post]['icon'] = $scope.icon;
          }

          $scope.bounds = {northeast: {latitude: bounds.getNorthEast().k, longitude: bounds.getNorthEast().D}, southwest: {latitude: bounds.getSouthWest().k, longitude: bounds.getSouthWest().D}};
          // $scope.map.zoom -= 1;
          $scope.rawPosts = body.data;

          $scope.posts = Posts = Object.keys(body.data).map(function(v){return body.data[v]});
          $scope.tags = Tags = body.tags;
          $scope.range = body.range;
          $scope.grandma = true;
          $scope.showDates = true;
          $scope.rangeResults = {message: "Pictures taken between " + $scope.range.earliest + " and " + $scope.range.latest};
        }
        $scope.loaded = true;
        angular.element(document.querySelector('#nav-container')).removeClass('expanded');

    }
    $scope.showTag = function(belongings) {
      belongings.forEach(function(post, index){
        $scope.rawPosts[post]['icon'] = $scope.altIcon;
      });
      $scope.showWindow = false;
    }

  })