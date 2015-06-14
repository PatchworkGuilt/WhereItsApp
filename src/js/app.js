app = angular.module('WhereItsApp', [
  'ngRoute',
  'mobile-angular-ui',
  'WhereItsAppControllers'
]);

app.config(function($routeProvider) {
  $routeProvider.when('/', {templateUrl:'home.html', controller: 'MainController'});
  $routeProvider.when('/offers/:offerId', {templateUrl:'item-detail.html',  controller: 'OfferDetailController'});
  $routeProvider.when('/create', {templateUrl:'item-create.html',  controller: 'OfferCreationController'});
});