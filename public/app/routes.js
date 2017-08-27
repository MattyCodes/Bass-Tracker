var app = angular.module('appRoutes', ['ngRoute'])

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
    controllerAs: 'register',
    authenticated: false
  })

  .when('/login', {
    templateUrl: 'app/views/pages/users/login.html',
    authenticated: false
  })

  .when('/profile', {
    templateUrl: 'app/views/pages/users/profile.html',
    authenticated: true
  })

  .when('/fish', {
    templateUrl: 'app/views/pages/fish/index.html',
    controller: 'fishCtrl',
    controllerAs: 'fish',
    authenticated: true
  })

  .when('/fish/new', {
    templateUrl: 'app/views/pages/fish/new.html',
    controller: 'fishCtrl',
    controllerAs: 'newFish',
    authenticated: true
  })

  .when('/fish/:id', {
    templateUrl: 'app/views/pages/fish/show.html',
    controller: 'showFishCtrl',
    controllerAs: 'fishCtrl',
    authenticated: true
  })

  .when('/users/edit', {
    templateUrl: 'app/views/pages/users/edit.html',
    controller: 'editUserCtrl',
    controllerAs: 'edit',
    authenticated: true
  })

  .when('/password/edit', {
    templateUrl: 'app/views/pages/users/password.html',
    controller: 'editUserCtrl',
    controllerAs: 'edit',
    authenticated: true
  })

  .when('/facebook/:token', {
    templateUrl: 'app/views/pages/social/facebook.html',
    controller: 'facebookCtrl',
    controllerAs: 'facebook',
    authenticated: false
  })

  .when('/facebookerror', {
    templateUrl: 'app/views/pages/users/login.html',
    controller: 'facebookCtrl',
    controllerAs: 'facebook',
    authenticated: false
  })

  .otherwise({ redirectTo: '/404' });

  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });

});

app.run(['$rootScope', 'Auth', '$location', function($rootScope, Auth, $location) {

  $rootScope.$on('$routeChangeStart', function(event, next, current) {

    if (next.$$route.authenticated == true) {
      if (!Auth.isLoggedIn()) {
        event.preventDefault();
        $location.path('/login');
      }
    } else if (next.$$route.authenticated == false) {
      if (Auth.isLoggedIn()) {
        event.preventDefault();
        $location.path('/');
      }
    }

  });

}]);
