(function() {
	'use strict';

	////////////////////////////////////////////////////
	// App module config
	////////////////////////////////////////////////////
	angular.module('app.config', ['app', 'ui.router'])
	.config(function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise("/search");
		$stateProvider
			.state('search', {
				url: "/search",
				templateUrl: "search.html",
				controller: ""
			});
	});
})();

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
		this.show = blog.show;
	}
})();

(function() {
	'use strict';

	////////////////////////////////////////////////////
	// AblumController
	////////////////////////////////////////////////////
	angular.module('app').controller('AlbumController', AlbumController);

	AlbumController.$inject = ['blog'];

	function AlbumController(blog) {
		this.showPreview = blog.getPhotos;
	}
})();

	////////////////////////////////////////////////////
	// Blog - Stateful Service (VM, Domaain Model)
	////////////////////////////////////////////////////
(function() {
	'use strict';
	angular.module('app').factory('blog', blog);

	blog.$inject = ['$http', 'users', 'posts', 'albums', '$q', 'photos'];

	function blog($http, users, posts, albums, $q, photos) {
		var service = {
			model: {
				userName: "",
				posts: [],
				albums: [],
				isBusy: false,
				error: null,
				selectedTab: "albums.html"
			},
			search: search,
			show: show,
			getPhotos: getPhotos
		}

		return service;

		function getPhotos(ablumId) {
			service.model.isBusy = true;
			service.model.error = null;

			photos.getPhotos(ablumId)
				.then(updatePhotos)
				.catch(handleError);
		}

		function show(tabToSow) {
			service.model.selectedTab = tabToSow + '.html';
		}

		function search() {
			service.model.isBusy = true;
			service.model.error = null;
			
			users.getUser(service.model.userToFind)
				.then(getAlbumsAndPostsByUser)
				.then(updateModel)
				.catch(handleError);
		}

		function getAlbumsAndPostsByUser(data) {
			return $q.all({
				posts: posts.getPostsByUser(data), 
				albums: albums.getAlbumsByUser(data)
			});
		}

		function updatePhotos(response) {
			for(var i=0;i<service.model.albums.length;i++) {
				if(service.model.albums[i].id === response.data[0].albumId) {
					service.model.albums[i].photos = response.data;
					break;
				}
			}

			service.model.isBusy = false;
		}

		function updateModel(data) {
			service.model.posts.length = 0;
			service.model.albums.length = 0;

			service.model.posts = data.posts.data;
			service.model.albums = data.albums.data;

			service.model.isBusy = false;
		}

		function handleError(error) {
			service.model.error = error.statusText;
			service.model.isBusy = false;
		}
	}
})();

	////////////////////////////////////////////////////
	// Photos - Data Service - Wraps API calls
	////////////////////////////////////////////////////
(function() {
	'use strict';
	angular.module('app').factory('photos', users);

	users.$inject = ['$http'];

	function users($http) {
		var service = {
			getPhotos: getPhotos
		}

		return service;

		function getPhotos(albumId) {
			// return the promise to allow promise chaining
			return $http.get(
				'http://jsonplaceholder.typicode.com/albums/' + albumId + '/photos');
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
	// Albums - Data Service - Wraps API calls
	////////////////////////////////////////////////////
(function() {
	'use strict';
	angular.module('app').factory('albums', albums);

	albums.$inject = ['$http'];

	function albums($http) {
		var service = {
			getAlbumsByUser: getAlbumsByUser
		};

		return service;

		function getAlbumsByUser(user) {
			// return the promise to allow promise chaining
			return $http.get(
					'http://jsonplaceholder.typicode.com/albums', 
					{ params: {userid: user.data[0].id}});
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
		};

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
