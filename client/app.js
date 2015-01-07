// app.js
angular.module('xyz', ['ngRoute', 'ngMessages', 'ngResource','satellizer', 'uiGmapgoogle-maps', 'mm.foundation', 'ngQuickDate', 'xeditable'])
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
    var theFrontEnd = 'http://localhost:8000/client';
    var theHost = "http://localhost:3000";
    // $authProvider.loginUrl = theHost + '/auth/login';
    // $authProvider.signupUrl = theHost + '/register';
    $authProvider.oauth2({
      name: 'instagram',
      url: theHost + '/auth/instagram',
      redirectUri: theFrontEnd,
      clientId: '077558afe95c4b83b77b8f9e2e02d072',
      requiredUrlParams: ['scope'],
      scope: ['likes'],
      scopeDelimiter: '+',
      authorizationEndpoint: 'https://api.instagram.com/oauth/authorize'
    })
  })
  // set currentUser, and configure editables
  .run(function($rootScope, $window, $auth, editableOptions, editableThemes) {
    if ($auth.isAuthenticated()) {
      $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
    }
    editableOptions.theme='default';
    editableThemes['default'].submitTpl = "<button type='submit' class='fi fi-check'></button>";
    editableThemes['default'].cancelTpl = "<button type='button' ng-click='$form.$cancel()' class='fi fi-x'>";
  })