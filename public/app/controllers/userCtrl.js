angular.module('userControllers', ['userServices'])

.controller('regCtrl', function($http, $location, $timeout, User, Auth, AuthToken) {

  var app = this;

  var displayMsg = function(txt) {
    app.msg = txt
  }

  this.regUser = function(regData) {
    app.success = null
    User.create(app.regData).then(function(res) {
      if (res.data.success) {
        app.success = true;
        displayMsg(res.data.message);
        Auth.login(app.regData).then(function(res) {
          AuthToken.setToken(res.data.token)
        });
        $timeout(function () {
          app.success = null;
          app.regData = '';
          $location.path('/');
        }, 1000);
      } else {
        app.success = false;
        displayMsg(res.data.message);
      }
    });
  };

});