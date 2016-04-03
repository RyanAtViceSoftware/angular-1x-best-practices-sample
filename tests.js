/////////////////////////////////////////////////
// Blog Controller
/////////////////////////////////////////////////
describe('BlogController ', function() {
	beforeEach(module('app'));

	var sut, $scope, $httpBackend;

	beforeEach(inject(function($controller, _$httpBackend_){
		$scope = {};
		sut = $controller('BlogController', { $scope: $scope });
		$httpBackend = _$httpBackend_;
	}));

	describe('on init ', function() {
		it('$scope.userName, isBusy and userToFind should be falsy and posts should be an emtpy array', function() {
			expect($scope.model.userName).toBeFalsy();
			expect($scope.model.userToFind).toBeFalsy();
			expect($scope.model.isBusy).toBeFalsy();
			expect($scope.model.posts).toBeDefined();
			expect($scope.model.posts.length).toBe(0);
		});
	});

	describe('when searching ', function() {
		it('isBusy should toggle correctly', function() {
			$httpBackend.expectGET('http://jsonplaceholder.typicode.com/users')
				.respond([{id: 1}]);
			$httpBackend.expectGET('http://jsonplaceholder.typicode.com/posts?userid=1')
				.respond({});

			expect($scope.model.isBusy).toBeFalsy();

			$scope.search();

			expect($scope.model.isBusy).toBeTruthy();

			$httpBackend.flush();

			expect($scope.model.isBusy).toBeFalsy();
		});

		it('isBusy should toggle correctly', function() {
			var expectedUser = 'expectedUser';
			$scope.model = { 
				userToFind: expectedUser,
				posts: []
			};

			var expectedUserId = 1;
			var expectedPosts = [{ foo: 'bar' }];

			$httpBackend.expectGET('http://jsonplaceholder.typicode.com/users?username=' + expectedUser)
				.respond([{id: expectedUserId}]);
			$httpBackend.expectGET('http://jsonplaceholder.typicode.com/posts?userid=' + expectedUserId)
				.respond(expectedPosts);

			$scope.search();

			expect($scope.model.isBusy).toBeTruthy();

			$httpBackend.flush();

			expect($scope.model.posts).toEqual(expectedPosts);
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