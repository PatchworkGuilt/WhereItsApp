var appServices = angular.module('WhereItsAppServices', []);

appServices.factory('config', function($cookies){
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

	var ENV_INDEX = $cookies.get("WIAPPEnvIndex") || 0;

	var getAttribute = function(attr){
		return environments[ENV_INDEX][attr];
	}

	this.toggleEnv = function(newEnv) {
		ENV_INDEX = (ENV_INDEX + 1) % environments.length;
		$cookies.put("WIAPPEnvIndex", ENV_INDEX);
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

appServices.factory('User', function($cookies, $rootScope, config){
	var userCookieID = function(){ return "WIAPPUser-" + config.getEnvName()};
	var loggedInUser = null;
	var user = $cookies.get(userCookieID());
	if (user) {
		loggedInUser = JSON.parse(user);
	}

	this.login = function(user) {
		$cookies.put(userCookieID(), JSON.stringify(user));
		loggedInUser = user;
	}

	this.logout = function() {
		$cookies.remove(userCookieID());
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

appServices.factory('RequestsCounter', function(){
	var numActiveRequests = 0;
	this.startRequest = function(thing) {
		numActiveRequests++;
	}

	this.completeRequest = function(){
		numActiveRequests--;
		if (numActiveRequests < 0)
			numActiveRequests = 0;
	}

	this.hasPendingRequests = function(){
		return numActiveRequests > 0;
	}

	return this;
});

appServices.factory('appHttpInterceptor', function($q, User, RequestsCounter){
	return {
		//TODO: ADD "AUTHORIZATION" header
	    'request': function(config) {
			// do something on success
			RequestsCounter.startRequest(config)
			return config;
	    },

	   'requestError': function(rejection) {
			// do something on error
			return $q.reject(rejection);
	    },

	    'response': function(response) {
			// do something on success
			RequestsCounter.completeRequest()
			return response;
	    },

	   'responseError': function(rejection) {
			RequestsCounter.completeRequest()
			// do something on error
			return $q.reject(rejection);
	    }
	  };
});

appServices.factory('NavBarService', function(){
	var ButtonTypes = {
		BACK: "BACK",
		MENU: "MENU"
	};
	var defaultState = {
		button: ButtonTypes.MENU,
		text: "WhereItsApp"
	};

	var currentState;

	return {
		ButtonTypes: ButtonTypes, 

		setState: function(text, button) {
			if (text != undefined && button) {
				currentState = {
					button: button,
					text: text
				}
			} else {
				console.error("Attempting to set bad NavBar state: ", text, button);
			}
		},

		setStateToDefault: function() {
			currentState = null;
		},

		getButtonType: function() {
			if (currentState) {
				return currentState.button;
			} else {
				return defaultState.button;
			}
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
