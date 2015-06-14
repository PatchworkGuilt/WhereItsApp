appControllers = angular.module('WhereItsAppControllers', []);

appControllers.controller('MainController', function($scope, $http){
	$scope.offers = []
	$http.get("http://localhost:5000/offers/mine")
	.success(function(data) {
		$scope.offers = data;
	})
	.error(function(data, status, headers, config){
		console.error(data);
	});
});

appControllers.controller("OfferDetailController", function($scope, $routeParams, $http){
	//$GET offer details from backend
	var offerId = $routeParams.offerId;
	$http.get('http://localhost:5000/offers/' + offerId)
	.success(function(data) {
		$scope.selectedOffer = data;
	})
	.error(function(data, status){
		console.error(data);
	});
});

appControllers.controller("OfferCreationController", ['$scope', function($scope, $routeParams){

}]);

