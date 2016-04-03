(function() {
	'use strict';

	var app = angular.module('app', []);

	////////////////////////////////////////////////////
	// BlogController
	////////////////////////////////////////////////////
	app.controller('BlogController', BlogController);

	BlogController.$inject = ['$http'];

	function BlogController($http) {
		var vm = this; // safe to use in callbacks
		
		vm.userName = "";
		vm.posts = [],
		vm.isBusy = false;
		vm.search = search;

		function search() {
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
	}

	////////////////////////////////////////////////////
	// blogSearchBox
	////////////////////////////////////////////////////
	app.directive('blogSearchBox', blogSearchBox);

	function blogSearchBox() {
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
			templateUrl: "blog-search.html" 	
		};
	}
})();
