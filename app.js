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
		vm.error = null;

		function search() {
			vm.isBusy = true;
			
			getUser(vm.userToFind)
				.then(getPostsByUser)
				.then(updateModel)
				.catch(handleError);
		}

		function getUser(userName) {
			vm.error = null;

			// return the promise to allow promise chaining
			return $http.get(
				'http://jsonplaceholder.typicode.com/users', 
				{ params: { username: userName}});
		}

		function getPostsByUser(user) {
			// return the promise to allow promise chaining
			return $http.get(
					'http://jsonplaceholder.typicode.com/posts', 
					{ params: {userid: user.data[0].id}});
		}

		function updateModel(posts) {
			vm.posts.length = 0;
			vm.posts = posts.data;

			vm.isBusy = false;
		}

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
