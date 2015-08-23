app = angular.module('WhereItsApp', [
  'ngRoute',
  'ngModal',
  'ngTouch',
  'LocalStorageModule',
  'WhereItsAppServices',
  'WhereItsAppControllers',
  'WhereItsAppDirectives'
]);

app.config(function($routeProvider, $httpProvider, ngModalDefaultsProvider) {
	$routeProvider.when('/', {redirectTo: "/mine"});
	$routeProvider.when('/login', {templateUrl:'templates/login-signup.html', controller: 'UserController'});
	$routeProvider.when('/my-account', {templateUrl:'templates/account.html', controller: 'UserController'});
	$routeProvider.when('/mine', {templateUrl:'templates/offers.html', controller: 'MyOffersController'});
	$routeProvider.when('/nearby', {templateUrl:'templates/offers.html',  controller: 'NearbyOffersController'});
	$routeProvider.when('/offers/:offerId', {templateUrl:'templates/offer-detail.html',  controller: 'OfferDetailController'});
	$routeProvider.when('/create', {templateUrl:'templates/offer-create.html',  controller: 'OfferCreationController'});

	ngModalDefaultsProvider.set('closeButtonHtml', '<i class="fa fa-times"></i>')
});

app.run(function(User, $http){
	$http.defaults.headers.common.Authorization = User.getAuthToken;
});

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    // Now safe to use the Cordova API

}