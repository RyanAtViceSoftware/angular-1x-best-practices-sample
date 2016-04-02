describe('BlogController ', function() {
	beforeEach(module('app'));

	var sut, $scope, $injector, $httpBackend;

	beforeEach(inject(function($controller, _$injector_, _$httpBackend_){
		$scope = {};
		sut = $controller('BlogController', { $scope: $scope });
		$injector = _$injector_;
		$httpBackend = _$httpBackend_;
	}));

	describe('on init ', function() {
		it('$scope.userName, isBusy and userToFind should be falsy and posts should be an emtpy array', function() {
			expect($scope.userName).toBeFalsy();
			expect($scope.userToFind).toBeFalsy();
			expect($scope.isBusy).toBeFalsy();
			expect($scope.posts).toBeDefined();
			expect($scope.posts.length).toBe(0);
		});
	});

	describe('when searching ', function() {
		it('isBusy should toggle correctly', function() {
			// var httpBackend = $injector.get('$httpBackend');
			$httpBackend.expectGET('http://jsonplaceholder.typicode.com/users')
				.respond([{id: 1}]);
			$httpBackend.expectGET('http://jsonplaceholder.typicode.com/posts?userid=1')
				.respond({});

			expect($scope.isBusy).toBeFalsy();

			$scope.search();

			expect($scope.isBusy).toBeTruthy();

			$httpBackend.flush();

			expect($scope.isBusy).toBeFalsy();
		});
	});

});