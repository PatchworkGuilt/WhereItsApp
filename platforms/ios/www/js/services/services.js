var appServices = angular.module('WhereItsAppServices', []);

appServices.factory('config', function(localStorageService){
	var environments = [{
		'name': 'Local',
		'url': "http://localhost:5000",
		'displayClass': "text-primary"
	},
	{
		'name': 'Staging',
		'url': "http://whereitsapi-staging.herokuapp.com",
		'displayClass': "text-warning"
	},
	{
		'name': 'Prod',
		'url': "http://whereitsapi-prod.herokuapp.com",
		'displayClass': "text-danger"
	}];

	var ENV_INDEX = localStorageService.get("WIAPPEnvIndex") || 0;

	var getAttribute = function(attr){
		return environments[ENV_INDEX][attr];
	}

	this.toggleEnv = function(newEnv) {
		ENV_INDEX = (ENV_INDEX + 1) % environments.length;
		localStorageService.set("WIAPPEnvIndex", ENV_INDEX);
	}

	this.getBaseUrl = function(){
		return getAttribute('url');
	};

	this.getEnvName = function(){
		return getAttribute('name');
	};

	this.getDisplayClass = function(){
		return getAttribute('displayClass');
	};

	return this;
});

appServices.factory('User', function($rootScope, config, localStorageService){
	var userStorageID = function(){ return "WIAPPUser-" + config.getEnvName()};
	var loggedInUser = null;
	var user = localStorageService.get(userStorageID());
	if (user) {
		loggedInUser = JSON.parse(user);
	}

	this.login = function(user) {
		localStorageService.set(userStorageID(), JSON.stringify(user));
		loggedInUser = user;
	}

	this.logout = function() {
		localStorageService.remove(userStorageID());
		loggedInUser = null;
	}

	this.isLoggedIn = function() {
		return !!loggedInUser;
	}

	this.getUserDetails = function() {
		var details = {};
		if (loggedInUser) {
			var whitelist = ['first_name', 'last_name', 'email'];
			for (var i=0; i<whitelist.length; i++) {
				var item = whitelist[i];
				details[item] = loggedInUser[item];
			}
		}
		return details; 
	}

	this.getAuthToken = function(){
		if (!!loggedInUser)
		{
			return loggedInUser['auth_token'];
		}
		return null;
	}

	return this;
});

appServices.factory('NavBarService', function(){
	var ButtonTypes = {
		BACK: "BACK",
		MENU: "MENU",
		REFRESH: "REFRESH"
	};
	var defaultState = {
		leftButton: ButtonTypes.MENU,
		text: "WhereItsApp",
		rightButton: null
	};

	var currentState;

	return {
		ButtonTypes: ButtonTypes, 

		setState: function(newState) {
			if (newState.text != undefined && newState.leftButton) {
				currentState = newState
			} else {
				console.error("Attempting to set bad NavBar state: ", newState);
			}
		},

		setStateToDefault: function() {
			currentState = null;
		},

		getLeftButtonType: function() {
			if (currentState) {
				return currentState.leftButton;
			} else {
				return defaultState.leftButton;
			}
		},
		getRightButtonType: function() {
			if (currentState) {
				return currentState.rightButton;
			} else {
				return defaultState.rightButton;
			}
		},

		getRightButtonCallback: function() {
			return currentState.rightButtonCallback;
		},

		getText: function() {
			if (currentState) {
				return currentState.text;
			} else {
				return defaultState.text;
			}
		}
	}
});

appServices.factory('LoadingSpinner', function(){
	var showSpinner = false;
	return {
		shouldShowSpinner: function(){
			return false;
		},
		showSpinner: function(){
			showSpinner = true;
		},
		hideSpinner: function(){
			showSpinner = false;
		}
	}
});
