app = angular.module('WhereItsApp', [
  'ngRoute',
  'ngCookies',
  'ngModal',
  'mobile-angular-ui',
  'WhereItsAppControllers',
  'WhereItsAppServices'
]);

app.config(function($routeProvider, $httpProvider, ngModalDefaultsProvider) {
	$routeProvider.when('/', {redirectTo: "/mine"});
	$routeProvider.when('/login', {templateUrl:'templates/login-signup.html', controller: 'UserController'});
	$routeProvider.when('/my-account', {templateUrl:'templates/account.html', controller: 'UserController'});
	$routeProvider.when('/mine', {templateUrl:'templates/offers.html', controller: 'MyOffersController'});
	$routeProvider.when('/nearby', {templateUrl:'templates/offers.html',  controller: 'NearbyOffersController'});
	$routeProvider.when('/offers/:offerId', {templateUrl:'templates/item-detail.html',  controller: 'OfferDetailController'});
	$routeProvider.when('/create', {templateUrl:'templates/item-create.html',  controller: 'OfferCreationController'});

	$httpProvider.interceptors.push('appHttpInterceptor');

	ngModalDefaultsProvider.set('closeButtonHtml', '<i class="fa fa-times"></i>')
});

app.run(function(User, $http){
	$http.defaults.headers.common.Authorization = User.getAuthToken;
});

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    // Now safe to use the Cordova API
	if(StatusBar) {
		alert("FOUND STATUSBAR");
		StatusBar.overlaysWebView(false);
	}
	else {
		alert("NO STATUSBAR");
	}
}