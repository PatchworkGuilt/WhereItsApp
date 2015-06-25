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

appControllers.controller("OfferCreationController", function($scope, $http, config){
	$scope.newOffer = {};

	$scope.onSubmit = function(){
		$http.post(config.getBaseUrl() + '/offers', $scope.newOffer)
		.success(function(data){
			$scope.message = "Offer successfully created.";
			$scope.newOffer = {};
		})
		.error(function(data, status){
			$scope.errorMessage = "Offer creation failed: " + data;
		});
	};
});

appControllers.controller("UserController", function($scope, $http, config, User){
	$scope.User = {};
	$scope.newUser = {};

	function isValidUser(user) {
		var required = ['first_name', 'last_name', 'email', 'password', 'password2'];
		for (var i=0; i<required.length; i++) {
			field = required[i];
			if (!user[field]) {
				$scope.errorMessage = field + " is required.";
				return false;
			}
		}

		if (user['password'] != user['password2']) {
			$scope.errorMessage = "Passwords don't match.";
				return false;
		}

		return true;
	};

	$scope.signup = function(){
		newUser = $scope.newUser;
		if (isValidUser(newUser)) {
			$http.post(config.getBaseUrl() + "/users", newUser)
			.success(function(data){
				$scope.message = "User " + newUser['email'] + " successfully signed up."
				User.login(data);
				$scope.newUser = {};
			})
			.error(function(data, status){
				$scope.errorMessage = "User creation failed: " + data;
			})
		}
	}

	$scope.login = function(){
		newUser = $scope.newUser;
		$scope.message = null;
		$scope.errorMessage = null;
		if (newUser.email && newUser.password) {
			$http.post(config.getBaseUrl() + "/login", newUser)
			.success(function(data){
				$scope.message = "User " + newUser['email'] + " successfully logged in."
				User.login(data);
				$scope.newUser = {};
			})
			.error(function(data, status){
				$scope.errorMessage = "User login failed: " + data;
			})
		}
	}

	$scope.logout = function(){
		$http.post(config.getBaseUrl() + "/logout")
		.success(function(data){
			$scope.message = "User successfully logged out."
			User.logout();
		})
		.error(function(data, status){
			$scope.errorMessage = "User login failed: " + data;
		})
	}
});

appControllers.controller("SidebarController", function($scope, User){
	$scope.userLoggedIn = User.isLoggedIn;
});


