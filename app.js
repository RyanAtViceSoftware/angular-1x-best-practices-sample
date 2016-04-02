(function() {
	'use strict';

	var app = angular.module('app', []);

	app.controller('BlogController', function ($scope, $http) {
		$scope.userName = "";
		$scope.posts = [];
		$scope.isBusy = false;

		$scope.search = function() {
			$scope.isBusy = true;
			$http.get(
				'http://jsonplaceholder.typicode.com/users', 
				{ params: { username: $scope.userToFind}})
				.then(function(user) {
					$http.get(
						'http://jsonplaceholder.typicode.com/posts', 
						{ params: {userid: user.data[0].id}})
					.then(function(posts) {
						$scope.posts.length = 0;
						$scope.posts = posts.data;

						$scope.isBusy = false;
					});
				})
		};
	});
})();
