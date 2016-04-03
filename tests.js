/////////////////////////////////////////////////
// Blog Controller
/////////////////////////////////////////////////
describe('BlogController ', function() {
	beforeEach(module('app'));

	var sut, $httpBackend;

	beforeEach(inject(function($controller, _$httpBackend_){
		sut = $controller('BlogController');
		$httpBackend = _$httpBackend_;
	}));

	describe('on init ', function() {
		it('$scope.userName, isBusy and userToFind should be falsy and posts should be an emtpy array', function() {
			expect(sut.userName).toBeFalsy();
			expect(sut.userToFind).toBeFalsy();
			expect(sut.isBusy).toBeFalsy();
			expect(sut.posts).toBeDefined();
			expect(sut.posts.length).toBe(0);
		});
	});

	describe('when searching ', function() {
		it('isBusy should toggle correctly', function() {
			$httpBackend.expectGET('http://jsonplaceholder.typicode.com/users')
				.respond([{id: 1}]);
			$httpBackend.expectGET('http://jsonplaceholder.typicode.com/posts?userid=1')
				.respond({});

			expect(sut.isBusy).toBeFalsy();

			sut.search();

			expect(sut.isBusy).toBeTruthy();

			$httpBackend.flush();

			expect(sut.isBusy).toBeFalsy();
		});

		it('isBusy should toggle correctly', function() {
			var expectedUser = 'expectedUser';
			sut.userToFind = expectedUser;
			sut.posts = [];

			var expectedUserId = 1;
			var expectedPosts = [{ foo: 'bar' }];

			$httpBackend.expectGET('http://jsonplaceholder.typicode.com/users?username=' + expectedUser)
				.respond([{id: expectedUserId}]);
			$httpBackend.expectGET('http://jsonplaceholder.typicode.com/posts?userid=' + expectedUserId)
				.respond(expectedPosts);

			sut.search();

			expect(sut.isBusy).toBeTruthy();

			$httpBackend.flush();

			expect(sut.posts).toEqual(expectedPosts);
		});

		it('error getting user should set error property', function() {
			var expectedUser = 'expectedUser';
			sut.userToFind = expectedUser;
			sut.posts = []
			sut.error = null;

			var expectedUserId = 1;
			var expectedPosts = [{ foo: 'bar' }];

			$httpBackend.expectGET('http://jsonplaceholder.typicode.com/users?username=' + expectedUser)
				.respond(function (method, url, data, headers) {
				    return [500, '', {}, 'error status text'];
				});

			sut.search();

			$httpBackend.flush();

			expect(sut.error).toBeTruthy();
		});

		it('error getting posts should set error property', function() {
			var expectedUser = 'expectedUser';
			sut.userToFind = expectedUser;
			sut.posts = []
			sut.error = null;

			var expectedUserId = 1;
			var expectedPosts = [{ foo: 'bar' }];

			$httpBackend.expectGET('http://jsonplaceholder.typicode.com/users?username=' + expectedUser)
				.respond([{id: expectedUserId}]);
			$httpBackend.expectGET('http://jsonplaceholder.typicode.com/posts?userid=' + expectedUserId)
				.respond(function (method, url, data, headers) {
				    return [500, '', {}, 'error status text'];
				});

			sut.search();

			$httpBackend.flush();

			expect(sut.error).toBeTruthy();
		});
	});

});

/////////////////////////////////////////////////
// Blog Controller
/////////////////////////////////////////////////
describe('BlogSearchBox ', function() {
	beforeEach(module('app'));

	var sut, $compile, $rootScope;

	beforeEach(inject(function(_$compile_, _$rootScope_){
		$compile = _$compile_;
		$rootScope = _$rootScope_;
	}));

	// Can't figure out how to test this one
	it('Replaces the element with the appropriate content', function() {
		var $scope = $rootScope.$new();
		var expectedUserName = "expectedUser";
		$scope.userName = expectedUserName;

	    // Compile a piece of HTML containing the directive
	    var element = $compile("<blog-search-box></blog-search-box>")($scope);
	    // fire all the watches, so the scope expression {{1 + 1}} will be evaluated
	    $scope.$digest();

	    // Check that the compiled element contains the templated content
	    var label = element[0].querySelector('label');
	    expect(label.innerHTML)
	    	.toBe("Posts by " + expectedUserName);
	});

});