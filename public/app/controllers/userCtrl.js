angular.module('userControllers', ['userServices'])

.controller('regCtrl', function($http, $location, $timeout, User) {

  var app = this;

  var displayMsg = function(txt) {
    app.msg = txt
  }

  this.regUser = function(regData) {
    app.success = null
    User.create(app.regData).then(function(res) {
      if (res.data.success) {
        app.regData = '';
        app.success = true;
        displayMsg(res.data.message);
        $timeout(function () {
          $location.path('/');
          app.success = null;
        }, 1000);
      } else {
        app.success = false;
        displayMsg(res.data.message);
      }
    });
  };

});
