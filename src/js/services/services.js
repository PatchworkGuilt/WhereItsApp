var appServices = angular.module('WhereItsAppServices', []);

appServices.factory('config', function(){
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

	var ENV_INDEX = 0;

	var getAttribute = function(attr){
		return environments[ENV_INDEX][attr];
	}

	this.toggleEnv = function(newEnv) {
		ENV_INDEX = (ENV_INDEX + 1) % environments.length;
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

appServices.factory('User', function($cookies, $rootScope){
	var userCookieID = "WIAPPUser";
	var loggedInUser = null;
	console.log("LOOKING FOR COOKIE");
	var user = $cookies.get(userCookieID);
	if (user) {
		loggedInUser = JSON.parse(user);
		console.log(user);
	}
	
	this.login = function(user) {
		$cookies.put(userCookieID, JSON.stringify(user));
		loggedInUser = user;
	}

	this.logout = function() {
		$cookies.remove(userCookieID);
		loggedInUser = null;
	}

	this.isLoggedIn = function() {
		return !!loggedInUser;
	}

	this.getUserDetails = function() {
		var whitelist = ['first_name', 'last_name', 'email'];
		var details = {};
		for (var i=0; i<whitelist.length; i++) {
			var item = whitelist[i];
			details[item] = loggedInUser[item];
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
		console.log("Requests: ", thing);
	}

	this.completeRequest = function(){
		numActiveRequests--;
		console.log("Requests: " + numActiveRequests);
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
