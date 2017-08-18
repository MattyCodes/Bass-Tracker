angular.module('bassApp', ['appRoutes', 'userControllers', 'userServices', 'mainController'])

.config(function($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptors');
});
