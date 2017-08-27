angular.module('fishServices', [])

.factory('editFish', function($http) {
  editFishFactory = {};

  editFishFactory.delete = function(id) {
    return $http.delete('api/fish/' + id);
  };

  return editFishFactory;
})

.factory('newFish', function($http) {
  newFishFactory = {};

  newFishFactory.new = function(formData) {
    return $http.post('/api/fish', formData, {
      transformRequest: angular.identity,
      headers: { 'Content-Type' : undefined }
    });
  };

  return newFishFactory;
})

.factory('getFish', function($http) {
  getFishFactory = {};

  getFishFactory.get = function(id) {
    return $http.get('/api/users/fish/' + id);
  };

  getFishFactory.getOne = function(id) {
    return $http.get('/api/fish/' + id);
  };

  return getFishFactory;
})
