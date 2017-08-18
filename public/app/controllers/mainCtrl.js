angular.module('mainController', ['userServices'])

.controller('mainCtrl', function(Auth, AuthToken, $timeout, $location, $window) {
    var app = this;

    if (Auth.isLoggedIn()) {
      console.log('Logged In.');
      Auth.currentUser().then(function(res) {
        app.id = res.data.id;
        app.name = res.data.name;
      });
    } else {
      console.log('Logged Out.');
    };


    var displayMsg = function(txt) {
      app.msg = txt
    };

    this.loginUser = function(loginData) {
      app.success = null
      Auth.login(app.loginData).then(function(res) {
        if (res.data.success) {
          AuthToken.setToken(res.data.token)
          app.loginData = '';
          app.success = true;
          displayMsg(res.data.message);
          $timeout(function () {
            $location.path('/');
            $window.location.reload();
            app.success = null;
          }, 1000);
        } else {
          app.success = false;
          displayMsg(res.data.message);
        }
      });
    };

    this.logout = function() {
      Auth.logout();
      $location.path('/');
      $window.location.reload();
    };

});
