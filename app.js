(function() {
	'use strict';

	var app = angular.module('app', []);

	app.controller('BlogController', function ($scope, $http) {
		$scope.model = {
			userName: "",
			posts: [],
			isBusy: false,
			error: null
		};
		

		$scope.search = function() {
			$scope.model.isBusy = true;
			$scope.model.error = null;
			
			$http.get(
				'http://jsonplaceholder.typicode.com/users', 
				{ params: { username: $scope.model.userToFind}})
				.then(function(user) {
					$http.get(
						'http://jsonplaceholder.typicode.com/posts', 
						{ params: {userid: user.data[0].id}})
					.then(function(posts) {
						$scope.model.posts.length = 0;
						$scope.model.posts = posts.data;

						$scope.model.isBusy = false;
					})
					.catch(handleError);
				})
				.catch(handleError);
		};

		function handleError(error) {
			$scope.model.error = error.statusText;
			$scope.model.isBusy = false;
		}

	});

	app.directive('blogSearchBox', function() {
		return {
			restrict: 'E',
			template: '<div class="jumbotron">' +
			'<label for="searchBox">{{"Posts by " + userName}}</span></label>' +
			'<div class="input-group">' +
				'<input name="searchBox" type="text" class="form-control" placeholder="Find posts by..." ng-model="model.userToFind">' +
				'<span class="input-group-btn">' +
					'<button class="btn btn-primary" type="button" ng-click="search()">' +
						'<span ng-show="model.isBusy" class="glyphicon glyphicon-refresh glyphicon-refresh-animate" aria-hidden="true"></span>' +
						'<span ng-hide="model.isBusy" class="glyphicon glyphicon-search" aria-hidden="true"></span>' +
					'</button>' +
				'</span>' +
			'</div>' +     
		'</div>'	
		};
	});
})();
