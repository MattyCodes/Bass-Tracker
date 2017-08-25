angular.module('fishControllers', ['fishServices'])

.controller('fishCtrl', function($scope, $http, $location, $timeout, newFish) {

  var app = this;
  $scope.file = {};

  app.create = function(data) {
    $scope.uploading = true;
    var fd = new FormData();

    for (key in data) {
      fd.append(key, data[key]);
    }

    var file = $('#imageFile')[0].files[0];
    fd.append('imageFile', file);

    newFish.new(fd).then(function(res) {
      $scope.uploading = false;
      $scope.success   = res.data.success;
      $scope.msg       = res.data.message;
      if (res.data.success) {
        $timeout(function() {
          $location.path('/');
        }, 1000);
      }
    });
  };

});
