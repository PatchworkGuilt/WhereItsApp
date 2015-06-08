var Config = Backbone.Model.extend({
	baseURL: function(){
		return this.get('url')
	},
	name: function() {
		return this.get('name')
	}
});

var localConfig = new Config({
	'name': 'local',
	'url': 'http://0.0.0.0:5000'
});

var stagingConfig = new Config({
	'name': 'staging',
	'url': 'http://whereitsapi-staging.herokuapp.com'
});

var prodConfig = new Config({
	'name': 'prod',
	'url': 'http://whereitsapi-prod.herokuapp.com'
});

var config = localConfig;