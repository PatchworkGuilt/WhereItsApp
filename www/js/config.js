var Config = Backbone.Model.extend({
	baseURL: function(){
		return this.get('url')
	}
});

var localConfig = new Config({
	'url': 'http://0.0.0.0:5000'
});

var stagingConfig = new Config({
	'url': 'http://whereitsapi-staging.heroku.com'
});

var prodConfig = new Config({
	'url': 'http://whereitsapi-staging.heroku.com'
});

var config = stagingConfig;