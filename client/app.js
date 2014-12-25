// app.js
angular.module('xyz', ['ngRoute', 'ngMessages', 'satellizer', 'uiGmapgoogle-maps', 'mm.foundation'])
  .config(function($routeProvider, $authProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'templates/home.html',
        controller:'HomeCtrl'
      })
      .when('/posts', {
        templateUrl: 'templates/posts.html',
        controller:'PostsCtrl'
      })
      .when('/collections', {
        templateUrl: 'templates/collections.html',
        controller: 'CollectionsCtrl'
      })
      .when('/collection/:id', {
        templateUrl: 'templates/collection-detail.html',
        controller: 'CollectionDetailCtrl'
      })
      .when('/post/:id', {
        templateUrl: 'templates/post-detail.html',
        controller: 'PostDetailCtrl'
      })
      .when('/tag/:id',{
        templateUrl: 'templates/tag-detail.html',
        controller: 'TagDetailCtrl'
      })
      .otherwise('/');
  })