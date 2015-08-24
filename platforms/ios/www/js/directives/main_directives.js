var appDirectives = angular.module('WhereItsAppDirectives', []);

appDirectives.directive('loadingSpinner', function(){
	return {
		templateUrl: 'templates/loadingSpinner.html'
	}
});