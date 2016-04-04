/////////////////////////////////////////////////
// Blog
/////////////////////////////////////////////////
describe('Blog ', function() {
	beforeEach(module('app'));

	var sut, $httpBackend;

	beforeEach(inject(function(blog, _$httpBackend_){
		sut = blog;
		$httpBackend = _$httpBackend_;
	}));

	describe('on init ', function() {
		it('$scope.userName, isBusy and userToFind should be falsy and posts should be an emtpy array', function() {
			expect(sut.model.userName).toBeFalsy();
			expect(sut.model.userToFind).toBeFalsy();
			expect(sut.model.isBusy).toBeFalsy();
			expect(sut.model.posts).toBeDefined();
			expect(sut.model.posts.length).toBe(0);
		});
	});

	describe('when searching ', function() {
		it('isBusy should toggle correctly', function() {
			$httpBackend.expectGET('http://jsonplaceholder.typicode.com/users')
				.respond([{id: 1}]);
			$httpBackend.expectGET('http://jsonplaceholder.typicode.com/posts?userid=1')
				.respond({});

			expect(sut.model.isBusy).toBeFalsy();

			sut.search();

			expect(sut.model.isBusy).toBeTruthy();

			$httpBackend.flush();

			expect(sut.model.isBusy).toBeFalsy();
		});

		it('isBusy should toggle correctly', function() {
			var expectedUser = 'expectedUser';
			sut.model.userToFind = expectedUser;

			var expectedUserId = 1;
			var expectedPosts = [{ foo: 'bar' }];

			$httpBackend.expectGET(
					'http://jsonplaceholder.typicode.com/users?username=' 
					+ expectedUser)
				.respond([{id: expectedUserId}]);

			$httpBackend.expectGET(
					'http://jsonplaceholder.typicode.com/posts?userid=' 
					+ expectedUserId)
				.respond(expectedPosts);

			sut.search();

			expect(sut.model.isBusy).toBeTruthy();

			$httpBackend.flush();

			expect(sut.model.posts).toEqual(expectedPosts);
		});

		it('error getting user should set error property', function() {
			var expectedUser = 'expectedUser';
			sut.model.userToFind = expectedUser;

			var expectedUserId = 1;
			var expectedPosts = [{ foo: 'bar' }];

			$httpBackend.expectGET(
					'http://jsonplaceholder.typicode.com/users?username=' 
					+ expectedUser)
				.respond(function (method, url, data, headers) {
				    return [500, '', {}, 'error status text'];
				});

			sut.search();

			$httpBackend.flush();

			expect(sut.model.error).toBeTruthy();
		});

		it('error getting posts should set error property', function() {
			var expectedUser = 'expectedUser';
			sut.model.userToFind = expectedUser;

			var expectedUserId = 1;
			var expectedPosts = [{ foo: 'bar' }];

			$httpBackend.expectGET(
					'http://jsonplaceholder.typicode.com/users?username=' 
					+ expectedUser)
				.respond([{id: expectedUserId}]);

			$httpBackend.expectGET(
					'http://jsonplaceholder.typicode.com/posts?userid=' 
					+ expectedUserId)
				.respond(function (method, url, data, headers) {
				    return [500, '', {}, 'error status text'];
				});

			sut.search();

			$httpBackend.flush();

			expect(sut.model.error).toBeTruthy();
		});
	});

});

/////////////////////////////////////////////////
// Blog Search Box
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