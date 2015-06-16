appControllers = angular.module('WhereItsAppControllers', []);

appControllers.controller('MainController', ['$scope', 'config', function($scope, config){
	$scope.config = config;
}]);

appControllers.controller('MyOffersController', ['$scope', '$http', 'config', function($scope, $http, config){
	$scope.offers = []
	$http.get(config.getBaseUrl() + "/offers/mine")
	.success(function(data) {
		$scope.offers = data;
	})
	.error(function(data, status, headers, config){
		console.error(data);
	});
}]);

appControllers.controller('NearbyOffersController', ['$scope', '$http', 'config', function($scope, $http, config){
	$scope.offers = []
	$http.get(config.getBaseUrl() + "/offers/nearby")
	.success(function(data) {
		$scope.offers = data;
	})
	.error(function(data, status, headers, config){
		console.error(data);
	});
}]);

appControllers.controller("OfferDetailController", ['$scope', '$http', '$routeParams', 'config', function($scope, $http, $routeParams, config){
	//$GET offer details from backend
	var offerId = $routeParams.offerId;
	$http.get(config.getBaseUrl() + '/offers/' + offerId)
	.success(function(data) {
		$scope.selectedOffer = data;
	})
	.error(function(data, status){
		console.error(data);
	});
}]);

appControllers.controller("OfferCreationController", function($scope, $http){
	$scope.newOffer = {};

	$scope.onSubmit = function(){
		$http.post('http://localhost:5000/offers', $scope.newOffer)
		.success(function(data){
			$scope.message = "Offer successfully created.";
			$scope.newOffer = {};
		})
		.error(function(data, status){
			$scope.errorMessage = "Offer creation failed: " + data;
		});
	};
});

