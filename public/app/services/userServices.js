angular.module('userServices', [])

.factory('User', function($http, AuthToken) {
  userFactory = {};

  userFactory.create = function(regData) {
    return $http.post('/api/users', regData).then(function(data) {
    });
  }
  return userFactory;
})

.factory('Auth', function($http, $q, AuthToken) {
  authFactory = {};

  authFactory.login = function(loginData) {
    return $http.post('/api/login', loginData);
  };

  authFactory.logout = function() {
    AuthToken.setToken();
  };

  authFactory.isLoggedIn = function() {
    if (AuthToken.getToken()) {
      return true;
    } else {
      return false;
    }
  };

  authFactory.currentUser = function() {
    var token = AuthToken.getToken();
    if (token) {
      return $http({
        url: '/api/currentuser',
        method: 'POST',
        contentType: "application/json",
        data: { token: token }
      });
    } else {
      $q.reject({ message: 'User has no token.' });
    }
  };

  return authFactory;
})

.factory('AuthToken', function($window) {
  authTokenFactory = {};

  authTokenFactory.setToken = function(token) {
    if (token) {
      $window.localStorage.setItem('token', token);
    } else {
      $window.localStorage.removeItem('token');
    }
  };

  authTokenFactory.getToken = function() {
    return $window.localStorage.getItem('token');
  };

  return authTokenFactory;
})

.factory('AuthInterceptors', function(AuthToken) {
  var authInterceptorsFactory = {};

  authInterceptorsFactory.request = function(config) {

    var token = AuthToken.getToken();

    if (token) config.headers['x-access-token'] = token;

    return config;
  };

  return authInterceptorsFactory;
});
