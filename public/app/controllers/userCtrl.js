angular.module('userControllers', ['userServices'])

.controller('regCtrl', function($http, $location, $timeout, User) {

  var app = this;

  var displayMsg = function(txt) {
    app.msg = txt
  }

  this.regUser = function(regData) {
    this.success = null
    User.create(app.regData).then(function(res) {
      if (res.data.success) {
        app.success = true;
        displayMsg(res.data.message);
        $timeout(function () {
          $location.path('/')
        }, 1000);
      } else {
        app.success = false;
        displayMsg(res.data.message);
      }
    });
  };

});
