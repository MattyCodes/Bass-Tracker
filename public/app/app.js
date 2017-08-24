angular.module('bassApp', ['appRoutes', 'userControllers', 'userServices', 'fishControllers', 'fishServices', 'mainController'])

.config(function($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptors');
});
