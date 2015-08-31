appControllers = angular.module('WhereItsAppControllers', []);

appControllers.controller('MainController', function($scope, config){
	$scope.config = config;
});

appControllers.controller("NavigationBarController", function($scope, NavBarService){
	$scope.getBarText = NavBarService.getText;
	$scope.getLeftButtonType = NavBarService.getLeftButtonType;
	$scope.getRightButtonType = NavBarService.getRightButtonType;

	$scope.goBack = function() {
		NavBarService.setStateToDefault();
		window.history.back();
	};

	$scope.rightButtonCallback = function(){
		var callback = NavBarService.getRightButtonCallback();
		if (callback)
			callback();
	};
});

appControllers.controller('MyOffersController', function($scope, $http, $location, NavBarService, config, User, localStorageService){
	if (!User.isLoggedIn()) {
		$location.path("/login");
		return;
	}
	NavBarService.setState({
		'text': "My Offers", 
		'leftButton': NavBarService.ButtonTypes.MENU, 
		'rightButton': NavBarService.ButtonTypes.REFRESH,
		'rightButtonCallback': $scope.getOffers
	});
	$scope.offers = localStorageService.get('myOffers') || [];
	$scope.getOffers = function() {
		$scope.showSpinner = true;
		$http.get(config.getBaseUrl() + "/offers/mine")
		.success(function(data) {
			$scope.offers = data;
			localStorageService.set('myOffers', data);
			$scope.showSpinner = false;
		})
		.error(function(data, status, headers, config){
			console.error(data);
			$scope.showSpinner = false;
		});
	};
	NavBarService.setState({
		'text': "My Offers", 
		'leftButton': NavBarService.ButtonTypes.MENU, 
		'rightButton': NavBarService.ButtonTypes.REFRESH,
		'rightButtonCallback': $scope.getOffers
	});
	if (!$scope.offers.length) {
		$scope.getOffers();	
	}
});

appControllers.controller('NearbyOffersController', function($scope, $http, NavBarService, config, localStorageService){
	$scope.offers = localStorageService.get('nearbyOffers') || []
	$scope.getOffers = function() {
		$scope.showSpinner = true;
		$http.get(config.getBaseUrl() + "/offers/nearby")
		.success(function(data) {
			$scope.offers = data;
			localStorageService.set('nearbyOffers', data);
			$scope.showSpinner = false;
		})
		.error(function(data, status, headers, config){
			console.error(data);
			$scope.showSpinner = false;
		});
	};
	NavBarService.setState({
		'text': "Public Offers",
		'leftButton': NavBarService.ButtonTypes.MENU,
		'rightButton': NavBarService.ButtonTypes.REFRESH,
		'rightButtonCallback': $scope.getOffers
	});
	if (!$scope.offers.length) {
		$scope.getOffers();	
	}
});

appControllers.controller("OfferDetailController", function($scope, $http, $routeParams, NavBarService, config){
	NavBarService.setState({'text': "", 'leftButton': NavBarService.ButtonTypes.BACK});
	var offerId = $routeParams.offerId;
	$http.get(config.getBaseUrl() + '/offers/' + offerId)
	.success(function(data) {
		$scope.selectedOffer = data;
	})
	.error(function(data, status){
		console.error(data);
	});
});

appControllers.controller("OfferCreationController", function($scope, $http, $location, NavBarService, config){
	NavBarService.setState({'text': "Create New", 'leftButton': NavBarService.ButtonTypes.MENU});
	$scope.newOffer = {};
	$scope.calculateAudience = function() {
		$scope.status = 'calculating';
		$http.get(config.getBaseUrl() + '/audience')
		.success(function(data){
			if ('confirmed' in data && 'new' in data) {
				$scope.status = 'success';
				$scope.audience = {
					'confirmed': data['confirmed'],
					'new': data['new']
				}
			} else {
				$scope.status = 'failed';
			}


		})
		.error(function(data, status){
			$scope.status = 'failed';
		})
	};

	$scope.calculateAudience();

	$scope.onSubmit = function(){
		$scope.showSpinner = true;
		$http.post(config.getBaseUrl() + '/offers', $scope.newOffer)
		.success(function(data){
			$scope.newOffer = {};
			$scope.showSpinner = false;
			$location.path('/nearby');
		})
		.error(function(data, status){
			$scope.errorMessage = data['message'];
			$scope.showSpinner = false;
		});
	};
});

appControllers.controller("UserController", function($scope, $http, $location, config, NavBarService, User){
	NavBarService.setState({'text': "", 'leftButton': NavBarService.ButtonTypes.MENU});
	$scope.User = {};
	$scope.newUser = {};
	if (User.isLoggedIn())
	{
		$scope.user = User.getUserDetails();
	}


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
		$scope.showSpinner = true;
		if (isValidUser(newUser)) {
			$http.post(config.getBaseUrl() + "/users", newUser)
			.success(function(data){
				User.login(data);
				$scope.newUser = {};
				$scope.showSpinner = false;
				$location.path("/mine");
			})
			.error(function(data, status){
				$scope.errorMessage = "User creation failed: " + data;
				$scope.showSpinner = false;
			})
		}
	}

	$scope.login = function(){
		newUser = $scope.newUser;
		$scope.message = null;
		$scope.errorMessage = null;
		if (newUser.email && newUser.password) {
			$scope.showSpinner = true;
			$http.post(config.getBaseUrl() + "/login", newUser)
			.success(function(data){
				User.login(data);
				$scope.newUser = {};
				$scope.showSpinner = false;
				$location.path("/mine");
			})
			.error(function(data, status){
				$scope.errorMessage = "User login failed: " + data;
				$scope.showSpinner = false;
			})
		}
	}

	$scope.logout = function(){
		$scope.showSpinner = true;
		$http.post(config.getBaseUrl() + "/logout")
		.success(function(data){
			User.logout();
			$scope.showSpinner = false;
			$location.path("/login");
		})
		.error(function(data, status){
			$scope.errorMessage = "User logout failed: " + data;
			$scope.showSpinner = false;
			User.logout();
		})
	}
});

appControllers.controller("SidebarController", function($scope, User){
	$scope.isUserLoggedIn = User.isLoggedIn;
	$scope.userDetails = User.getUserDetails;
});

appControllers.controller("OfferResponseController", function($scope, $http, $route, $routeParams, config, User){
	$scope.isUserLoggedIn = User.isLoggedIn;

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

appControllers.controller("LoadingSpinnerController", function($scope, LoadingSpinner){
	$scope.shouldShowSpinner = LoadingSpinner.shouldShowSpinner;
});





