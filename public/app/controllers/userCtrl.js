angular.module('userControllers', ['userServices'])

.controller('regCtrl', function($http, $location, $timeout, User, Auth, AuthToken, Edit) {

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
          $location.path('/');
          app.regData = '';
        }, 1000);
      } else {
        app.success = false;
        displayMsg(res.data.message);
      }
    });
  };

})

.controller('editUserCtrl', function($http, $location, $timeout, Edit, Auth, AuthToken) {

  var app = this;
  app.success = null;

  app.updateUser = function(formData) {
    Edit.update(formData).then(function(res) {
      if (res.data.token) AuthToken.setToken(res.data.token);
      app.success = res.data.success;
      app.msg = res.data.message;

      $timeout(function() {
        if (app.success) {
          $location.path('/profile');
        }
      }, 1200);
    })
  };

  app.deleteUser = function(id, fb, password) {
    data = { id: id, password: password, fb: fb }
    if (confirm('Are you sure you want to delete your account?')) {
      Edit.delete(data).then(function(res) {
        app.success = res.data.success;
        app.msg     = res.data.message;

        $timeout(function() {
          if (app.success || res.nullUser) {
            Auth.logout();
            $location.path('/');
          }
        }, 1200);
      })
    }
  };

  app.changePassword = function(data) {
    if (confirm('Are you sure you want to change you password?')) {
      Edit.updatePassword(data).then(function(res) {
        app.success = res.data.success;
        app.msg     = res.data.message;

        if (app.success) {
          $timeout(function() {
            $location.path('/');
          }, 900);
        } else if (res.nullUser) {
          Auth.logout();
          $location.path('/');
        }
      })
    }
  };

})

.controller('facebookCtrl', function(Auth, $window, $timeout, $routeParams, $location) {
  var app = this;

  if ($window.location.pathname == '/facebookerror') {
    app.success = false;
    app.msg     = 'Could not authenticate Facebook account.';
  } else if ($routeParams.token) {
    app.success = true;
    app.msg     = '';
    Auth.facebook($routeParams.token);
    $timeout(function () {
      $location.path('/');
    }, 1000);
  } else {
    app.success = null;
    app.msg = '';
    $location.path('/');
  }

});
