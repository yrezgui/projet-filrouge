var adminHomeCtrl = function adminHomeCtrl($scope, $http, auth) {
	if(!auth.verify())
		return;

	$scope.doctors = [];
	$http({
		method: 'get',
		url: '/api/medics/',
		params: {token: auth.getToken()}
	})
	.success(function(data) {
		$scope.doctors = data;
	});
};

var adminEditCtrl = function adminEditCtrl($routeParams, $scope, $http, auth) {
	if(!auth.verify())
		return;

	$scope.id	= $routeParams.id;
	$scope.type	= $routeParams.type;

	$scope.personLoad = function personLoad(id) {
		if(!id)
			return false;
	};

	$scope.medicLoad = function medicLoad(id) {
		if(!id)
			return false;
	};

	$scope.load = function load() {
		if($scope.id) {
			$http({
				method: 'get',
				url: '/api/' + $scope.type + '/' + $scope.id,
				params: {token: auth.getToken()}
			})
			.success(function(data) {
				console.log(data);
				$scope.edit	= data.user;
				$scope.edit.password = '';

				$scope.edit.service = {
					key: data.service.id,
					value: data.service.name
				};

				$scope.edit.speciality = {
					key: data.speciality.id,
					value: data.speciality.name
				};
			});
		}
	};

	$scope.save = function save() {
		if($scope.id) {

			if($scope.edit.password == '') {
				$scope.edit.password = null;
			}

			$http({
				method: 'put',
				url: '/api/' + $scope.type + 's/' + $scope.id,
				params: {token: auth.getToken()},
				data: $scope.edit
			})
			.success(function(data) {
				console.log(data);
			});
		}
		else {
			
			$http({
				method: 'post',
				url: '/api/' + $scope.type + 's/',
				params: {token: auth.getToken()},
				data: $scope.edit
			})
			.success(function(data) {
				console.log(data);
			});	
		}
	};
};