(function() {
	'use strict';

	////////////////////////////////////////////////////
	// BlogController
	////////////////////////////////////////////////////
	angular.module('app', []).controller('BlogController', BlogController);

	BlogController.$inject = ['blog'];

	function BlogController(blog) {
		// nothing interesting to test here
		this.model = blog.model;
		this.search = blog.search;
	}
})();

	////////////////////////////////////////////////////
	// Blog - Stateful Service (VM, Domaain Model)
	////////////////////////////////////////////////////
(function() {
	'use strict';
	angular.module('app').factory('blog', blog);

	blog.$inject = ['$http', 'users', 'posts'];

	function blog($http, users, posts) {
		var service = {
			model: {
				userName: "",
				posts: [],
				isBusy: false,
				search: search,
				error: null
			},
			search: search
		}

		return service;

		function search() {
			service.model.isBusy = true;
			service.model.error = null;
			
			users.getUser(service.model.userToFind)
				.then(posts.getPostsByUser)
				.then(updateModel)
				.catch(handleError);
		}

		function updateModel(posts) {
			service.model.posts.length = 0;
			service.model.posts = posts.data;

			service.model.isBusy = false;
		}

		function handleError(error) {
			service.model.error = error.statusText;
			service.model.isBusy = false;
		}
	}
})();

	////////////////////////////////////////////////////
	// Users - Data Service - Wraps API calls
	////////////////////////////////////////////////////
(function() {
	'use strict';
	angular.module('app').factory('users', users);

	users.$inject = ['$http'];

	function users($http) {
		var service = {
			getUser: getUser
		}

		return service;

		function getUser(userName) {
			// return the promise to allow promise chaining
			return $http.get(
				'http://jsonplaceholder.typicode.com/users', 
				{ params: { username: userName}});
		}
	}
})();

	////////////////////////////////////////////////////
	// Posts - Data Service - Wraps API calls
	////////////////////////////////////////////////////
(function() {
	'use strict';
	angular.module('app').factory('posts', posts);

	posts.$inject = ['$http'];

	function posts($http) {
		var service = {
			getPostsByUser: getPostsByUser
		}

		return service;

		function getPostsByUser(user) {
			// return the promise to allow promise chaining
			return $http.get(
					'http://jsonplaceholder.typicode.com/posts', 
					{ params: {userid: user.data[0].id}});
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
