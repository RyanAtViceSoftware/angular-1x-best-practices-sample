(function() {
	'use strict';

	////////////////////////////////////////////////////
	// BlogController
	////////////////////////////////////////////////////
	angular.module('app', []).controller('BlogController', BlogController);

	BlogController.$inject = ['blog'];

	function BlogController(blog) {
		// nothing interesting to test here
		var vm = this;
		vm.model = {
				userName: "",
				posts: [],
				isBusy: false,
				error: null
			};

		vm.search = function(){
			vm.model.isBusy = true;
			
			blog.search(vm.model.userName)
				.then(updateModel)
				.catch(handleError);
		}

		function updateModel(posts) {
			vm.model.posts.length = 0;
			vm.model.posts = posts.data;

			vm.model.isBusy = false;
		}

		function handleError(error) {
			vm.model.error = error.statusText;
			vm.model.isBusy = false;
		}
	}
})();

	////////////////////////////////////////////////////
	// Blog - Stateful Service (VM, Domaain Model)
	////////////////////////////////////////////////////
(function() {
	'use strict';
	angular.module('app').factory('blog', blog);

	blog.$inject = ['$http', 'users', 'posts', '$q', '$log'];

	function blog($http, users, posts, $q, log) {
		var service = {
			search: search
		}

		return service;

		function search(userToFind) {
			var deferred = $q.defer();
			
			users.getUser(userToFind)
				.then(function (user) {
					posts.getPostsByUser(user)
					.then(function(posts) {
						deferred.resolve(posts);
					})
					.catch(function(error) {
						handleError(deferred, error);
					});
				})
				.catch(function(error) {
					handleError(deferred, error);
				});

			return deferred.promise;
		}

		function handleError(deffered, error) {
			$log.error(error);
			deferred.reject(error);
		}
	}
})();

	////////////////////////////////////////////////////
	// Users - Data Service - Wraps API calls
	////////////////////////////////////////////////////
(function() {
	'use strict';
	angular.module('app').factory('users', users);

	users.$inject = ['$http', '$q', '$log'];

	function users($http, $q, $log) {
		var service = {
			getUser: getUser
		}

		return service;

		function getUser(userName) {
			// return the promise to allow promise chaining
			return $http.get(
				'http://jsonplaceholder.typicode.com/users', 
				{ params: { username: userName}});

			var deferred = $q.defer();

			// return the promise to allow promise chaining
			$http.get(
				'http://jsonplaceholder.typicode.com/users', 
				{ params: { username: userName}})
			.then(function(data) {
				deferred.resolve(data);
			})
			.catch(function(error) {
				$log.error(
					"Unable to retrieve user details for user: "
					+ userName);
				deferred.reject(error);
			});

			return deferred.promise;
		}
	}
})();

	////////////////////////////////////////////////////
	// Posts - Data Service - Wraps API calls
	////////////////////////////////////////////////////
(function() {
	'use strict';
	angular.module('app').factory('posts', posts);

	posts.$inject = ['$http', '$q', '$log'];

	function posts($http, $q, $log) {
		var service = {
			getPostsByUser: getPostsByUser
		}

		return service;

		function getPostsByUser(user) {
			var deferred = $q.defer();

			// return the promise to allow promise chaining
			$http.get(
					'http://jsonplaceholder.typicode.com/posts', 
					{ params: {userid: user.data[0].id}})
			.then(function(data) {
				deferred.resolve(data);
			})
			.catch(function(error) {
				$log.error(
					"Unable to retrieve blog posts for user: "
					+ user.data[0].username);
				deferred.reject(error);
			});

			return deferred.promise;
		}
	}
})();

	////////////////////////////////////////////////////
	// blogSearchBox
	////////////////////////////////////////////////////
(function() {
	'use strict';
	angular.module('app').directive('blogSearchBox', blogSearchBox);

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
