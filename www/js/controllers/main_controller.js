appControllers = angular.module('WhereItsAppControllers', []);

appControllers.controller('MainController', ['$scope', 'config', function($scope, config){
	$scope.config = config;
}]);

appControllers.controller("NavigationBarController", function($scope, NavBarService){
	$scope.getBarText = NavBarService.getText;
	$scope.getButtonType = NavBarService.getButtonType;

	$scope.goBack = function() {
		NavBarService.setStateToDefault();
		window.history.back();
	};
});

appControllers.controller('MyOffersController', ['$scope', '$http', 'config', function($scope, $http, config){
	$scope.offers = $scope.offers || [];
	$scope.getOffers = function() {
		$http.get(config.getBaseUrl() + "/offers/mine")
		.success(function(data) {
			$scope.offers = data;
		})
		.error(function(data, status, headers, config){
			console.error(data);
		});
	};
	if (!$scope.offers.length) {
		$scope.getOffers();	
	}
}]);

appControllers.controller('NearbyOffersController', ['$scope', '$http', 'config', function($scope, $http, config){
	$scope.offers = $scope.offers || []
	$scope.getOffers = function() {
		$http.get(config.getBaseUrl() + "/offers/nearby")
		.success(function(data) {
			$scope.offers = data;
		})
		.error(function(data, status, headers, config){
			console.error(data);
		});
	};
	if (!$scope.offers.length) {
		$scope.getOffers();	
	}
}]);

appControllers.controller("OfferDetailController", function($scope, $http, $routeParams, NavBarService, config){
	//$GET offer details from backend
	NavBarService.setState("", NavBarService.ButtonTypes.BACK);
	var offerId = $routeParams.offerId;
	$http.get(config.getBaseUrl() + '/offers/' + offerId)
	.success(function(data) {
		$scope.selectedOffer = data;
	})
	.error(function(data, status){
		console.error(data);
	});
});

appControllers.controller("OfferCreationController", function($scope, $http, config){
	$scope.newOffer = {};
	
	$scope.onSubmit = function(){
		$http.post(config.getBaseUrl() + '/offers', $scope.newOffer)
		.success(function(data){
			$scope.message = "Offer successfully created.";
			$scope.newOffer = {};
		})
		.error(function(data, status){
			$scope.errorMessage = data['message'];
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
			$scope.errorMessage = "User logout failed: " + data;
			User.logout();
		})
	}
});

appControllers.controller("SidebarController", function($scope, User){
	$scope.isUserLoggedIn = User.isLoggedIn;
	$scope.user = User.getUserDetails()
});

appControllers.controller("OfferResponseController", function($scope, $http, $route, $routeParams, config, User){
	$scope.isUserLoggedIn = User.isLoggedIn;
	$scope.showDropdown = false;

	$scope.toggleHatridDropdown = function(){
		if($scope.showDropdown)
			$scope.showDropdown = false;
		else
			$scope.showDropdown = true;
	}

	$scope.respondToOffer = function(response) {
		postData = {'response': response};
		$scope.showDropdown = false;
		$http.post(config.getBaseUrl() + "/offers/" + $routeParams.offerId + "/response", postData)
		.success(function(data){
			$route.reload();
		})
		.error(function(data, status){
			alert("Something went wrong.  We were unable to save your response");
		});
	}

	$scope.responseDisplayClass = function(response) {
		switch (response) {
			case "ACCEPT":
				return "bg-success"; break;
			case "DECLINE":
				return "bg-warning"; break;
			default:
				return "bg-danger";
		}
	}

	var ResponseDisplayMap = {
		'ACCEPT': {'fragment': 'success', 'icon': 'fa-check', 'text': "Great! You are going."},
		'DECLINE': {'fragment': 'warning', 'icon': 'fa-close', 'text': "Sorry you can't make it."},
		'DEFAULT': {'fragment': 'danger', 'icon': 'fa-ban', 'text': "You hate it. We'll let them know."}
	}

	function getDisplayByResponse(response) {
		display = ResponseDisplayMap[response];
		if (!display) {
			display = ResponseDisplayMap['DEFAULT'];
		}
		return display;
	}

	$scope.responseDisplayClassFragment = function(response) {
		display = getDisplayByResponse(response)
		return display['fragment'];
	}
	
	$scope.responseDisplayIconClass = function(response) {
		display = getDisplayByResponse(response)
		return display['icon'];
	}

	$scope.responseDisplayText = function(response) {
		display = getDisplayByResponse(response)
		return display['text'];
	}
});

appControllers.controller("LoadingSpinnerController", function($scope, RequestsCounter){
	$scope.shouldShowSpinner = RequestsCounter.hasPendingRequests;
});




