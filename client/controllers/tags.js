// tags.js
angular.module('xyz')
  .controller('TagsCtrl', function($scope, $interval, Tags){
    $scope.news = $scope.tags;
    $scope.conf = {
        news_length: false,
        news_pos: 200, // the starting position from the right in the news container
        news_margin: 20,
        news_move_flag: true
    };
    $scope.$watch('tags', function(){
      $scope.conf.news_pos = 200;
    })
    $scope.init = function() {
        // $http.post('the_news_file.json', null).success(function(data) {
            // if (data && data.length > 0) {
                $scope.news = $scope.tags;
                $interval($scope.news_move, 1);
            // }
        // });
    };
    //rewrite the next two functions to wrap around when approaching final tag
    $scope.get_news_right = function(idx) {
        var $right = $scope.conf.news_pos;
        for (var ri=0; ri < 1; ri++) {
            if (document.getElementById('news_'+ri)) {
                $right += $scope.conf.news_margin + angular.element(document.getElementById('news_'+ri))[0].offsetWidth;
            }
        }
        return $right+'px';
    };

    $scope.news_move = function() {

        if ($scope.conf.news_move_flag) {
            $scope.conf.news_pos--;
            // if ( angular.element(document.getElementById('news_0'))[0].offsetWidth > angular.element(document.getElementById('news_strip'))[0].offsetWidth + $scope.conf.news_margin ) {
            //     var first_new = $scope.news[0];
            //     $scope.news.push(first_new);
            //     $scope.news.shift();
            //     $scope.conf.news_pos += angular.element(document.getElementById('news_0'))[0].offsetWidth + $scope.conf.news_margin;
            // }
        }
    };

  })