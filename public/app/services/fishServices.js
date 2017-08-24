angular.module('fishServices', [])

.factory('newFish', function($http) {
  newFishFactory = {};

  newFishFactory.new = function(formData) {
    return $http.post('/api/fish', formData, {
      transformRequest: angular.identity,
      headers: { 'Content-Type' : undefined }
    });
  };

  return newFishFactory;
});
