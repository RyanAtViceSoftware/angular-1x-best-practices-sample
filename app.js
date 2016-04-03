(function() {
	'use strict';

	var app = angular.module('app', []);

	app.controller('BlogController', function ($http) {
		var vm = this; // safe to use in callbacks
		
		vm.userName = "";
		vm.posts = [],
		vm.isBusy = false;
		

		vm.search = function() {
			vm.isBusy = true;
			$http.get(
				'http://jsonplaceholder.typicode.com/users', 
				{ params: { username: vm.userToFind}})
				.then(function(user) {
					$http.get(
						'http://jsonplaceholder.typicode.com/posts', 
						{ params: {userid: user.data[0].id}})
					.then(function(posts) {
						vm.posts.length = 0;
						vm.posts = posts.data;
						vm.isBusy = false;
					})
					.catch(handleError);
				})
				.catch(handleError);
		};

		function handleError(error) {
			vm.error = error.statusText;
			vm.isBusy = false;
		}

	});

	app.directive('blogSearchBox', function() {
		return {
			restrict: 'E',
			scope: {},
			bindToController: {
				userName: "=",
				onSearch: "&",
				isBusy: "="
			},
			controllerAs: "blogSearchBoxVm",
			controller: function() {},
			template: '<div class="jumbotron">' +
			'<label for="searchBox">{{"Posts by " + blogSearchBoxVm.userName}}</span></label>' +
			'<div class="input-group">' +
				'<input name="searchBox" type="text" class="form-control" placeholder="Find posts by..." ng-model="blogSearchBoxVm.userName">' +
				'<span class="input-group-btn">' +
					'<button class="btn btn-primary" type="button" ng-click="blogSearchBoxVm.onSearch()">' +
						'<span ng-show="blogSearchBoxVm.isBusy" class="glyphicon glyphicon-refresh glyphicon-refresh-animate" aria-hidden="true"></span>' +
						'<span ng-hide="blogSearchBoxVm.isBusy" class="glyphicon glyphicon-search" aria-hidden="true"></span>' +
					'</button>' +
				'</span>' +
			'</div>' +     
		'</div>'	
		};
	});
})();
