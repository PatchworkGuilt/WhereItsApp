app = angular.module('WhereItsApp', [
  'ngRoute',
  'mobile-angular-ui',
  'WhereItsAppControllers',
  'WhereItsAppServices'
]);

app.config(function($routeProvider) {
  $routeProvider.when('/', {templateUrl:'offers.html', controller: 'MyOffersController'});
  $routeProvider.when('/nearby', {templateUrl:'offers.html',  controller: 'NearbyOffersController'});
  $routeProvider.when('/offers/:offerId', {templateUrl:'item-detail.html',  controller: 'OfferDetailController'});
  $routeProvider.when('/create', {templateUrl:'item-create.html',  controller: 'OfferCreationController'});
});