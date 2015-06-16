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