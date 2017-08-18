angular.module('appRoutes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {

  $routeProvider

  .when('/404', {
    templateUrl: 'app/views/pages/404.html'
  })

  .when('/', {
    templateUrl: 'app/views/pages/home.html'
  })

  .when('/about', {
    templateUrl: 'app/views/pages/about.html'
  })

  .when('/signup', {
    templateUrl: 'app/views/pages/users/signup.html',
    controller: 'regCtrl',
    controllerAs: 'register'
  })

  .when('/login', {
    templateUrl: 'app/views/pages/users/login.html'
  })

  .when('/facebook/:token', {
    templateUrl: 'app/views/pages/social/facebook.html',
    controller: 'facebookCtrl',
    controllerAs: 'facebook'
  })

  .when('/facebookerror', {
    templateUrl: 'app/views/pages/users/login.html',
    controller: 'facebookCtrl',
    controllerAs: 'facebook'
  })

  .otherwise({ redirectTo: '/404' });

  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });

});
