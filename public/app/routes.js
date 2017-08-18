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

  .otherwise({ redirectTo: '/404' });

  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });

});
