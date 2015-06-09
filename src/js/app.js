angular.module('WhereItsApp', [
  'ngRoute',
  'mobile-angular-ui',
  'WhereItsApp.controllers.Main'
])

.config(function($routeProvider) {
  $routeProvider.when('/', {templateUrl:'home.html',  reloadOnSearch: false});
});