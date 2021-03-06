angular.module('fishControllers', ['fishServices'])

.controller('fishCtrl', function($scope, $http, $location, $window, $timeout, newFish, getFish, editFish) {

  var app = this;

  $scope.filterResults = function(keyword) {
    $scope.searchKeyword = keyword;
  };

  app.getFish = function(id) {
    getFish.get(id).then(function(res) {
      $scope.fish = (res.data.fish ? res.data.fish : null);
    });
  };

  $scope.deleteFish = function(id) {
    if (confirm('Are you sure you want to delete this fish?')) {
      editFish.delete(id).then(function(res) {
        $window.location.reload();
      });
    }
  };

  $scope.file = {};

  app.create = function(data) {
    $scope.uploading = true;
    var fd = new FormData();

    for (key in data) {
      if (data[key] == undefined) {
        fd.append(key, 'nullInput');
      } else {
        fd.append(key, data[key]);
      }
    }

    var file = $('#imageFile')[0].files[0];
    fd.append('imageFile', file);

    newFish.new(fd).then(function(res) {
      $scope.uploading = false;
      $scope.success   = res.data.success;
      $scope.msg       = res.data.message;
      if (res.data.success) {
        $timeout(function() {
          $location.path('/fish');
        }, 1000);
      }
    });
  };

})

.controller('showFishCtrl', function($scope, $routeParams, $location, getFish, editFish) {

    getFish.getOne($routeParams['id']).then(function(res) {
      if (res.data.fish) $scope.fish = res.data.fish[0];
    });

    $scope.deleteFish = function(id) {
      if (confirm('Are you sure you want to delete this fish?')) {
        editFish.delete(id).then(function(res) {
          $location.path('/fish');
        });
      }
    };

})

.controller('editFishCtrl', function($scope, $routeParams, $timeout, $location, getFish, editFish) {

  $scope.file = {};

  getFish.getOne($routeParams['id']).then(function(res) {
    if (res.data.fish) $scope.fish = res.data.fish[0];
  });

  this.update = function(formData) {
    $scope.uploading = true;
    var fd = new FormData();

    for (key in formData) {
      if (formData[key] == undefined) {
        fd.append(key, 'nullInput');
      } else {
        fd.append(key, formData[key]);
      }
    }

    var id = $routeParams['id'];
    fd.append('id', id);

    var file = $('#imageFile')[0].files[0];
    fd.append('imageFile', file);

    editFish.edit(fd, id).then(function(res) {
      $scope.uploading = false;
      $scope.success   = res.data.success;
      $scope.msg       = res.data.message;
      if (res.data.success) {
        $timeout(function() {
          $location.path('/fish');
        }, 1000);
      }
    });
  };

  $scope.deleteFish = function() {
    if (confirm('Are you sure you want to delete this fish?')) {
      editFish.delete($routeParams['id']).then(function(res) {
        $location.path('/fish');
      });
    }
  };

});
