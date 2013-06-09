var rdvHomeCtrl = function rdvHomeCtrl($scope, $http, auth) {
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

var rdvDetailCtrl = function rdvDetailCtrl($scope, $http, auth) {
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

var rdvListCtrl = function rdvListCtrl($scope, $http, auth) {
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

var rdvListMonthCtrl = function rdvListMonthCtrl($scope, auth, $http, $location, $routeParams, calendar) {
	if(!auth.verify())
		return;
	
	if($routeParams.year == 0 || $routeParams.month == 0) {
		var now = new Date();
		$routeParams.year = now.getFullYear();
		$routeParams.month = now.getMonth() + 1;
	}

	$scope.date = {
		idMedic: $routeParams.idMedic,
		format: calendar.encodeFromString($routeParams.year, $routeParams.month),
		month: $routeParams.month,
		monthLabel: calendar.getLabelMonth($routeParams.month),
		year: $routeParams.year
	};

	var actualMonth = new Date($routeParams.year, parseInt($routeParams.month) -1, 1);
	var nowMonth = new Date();
	nowMonth = new Date(nowMonth.getFullYear(), nowMonth.getMonth(), 1);

	$scope.previousMonth = new Date(actualMonth);
	$scope.previousMonth.setMonth($scope.previousMonth.getMonth() - 1);

	$scope.previousMonth = {
		disabled: ($scope.previousMonth < nowMonth) ? true : false,
		month: $scope.previousMonth.getMonth(),
		year: $scope.previousMonth.getFullYear()
	};

	$scope.nextMonth = new Date(actualMonth);
	$scope.nextMonth.setMonth($scope.nextMonth.getMonth() + 1);

	$scope.nextMonth = {
		month: $scope.nextMonth.getMonth(),
		year: $scope.nextMonth.getFullYear()
	};

	$http({
		method: 'get',
		url: '/api/medics/' + $scope.date.idMedic,
		params: {token: auth.getToken()}
	})
	.success(function(data) {
		if(!data) {
			$location.url('/404');
		}

		$scope.doctor = data;
	});
};

var rdvListDayCtrl = function rdvListDayCtrl($scope, $http, auth, calendar, timetable, $routeParams) {
	if(!auth.verify())
		return;

	if($routeParams.year == 0 || $routeParams.month == 0) {
		$location.url('/rdv/list/' + $routeParams.idMedic + '/0/0');
	}
	
	$scope.date = {
		idMedic: $routeParams.idMedic,
		day: $routeParams.day,
		month: $routeParams.month,
		monthLabel: calendar.getLabelMonth($routeParams.month),
		year: $routeParams.year
	};

	$http({
		method: 'get',
		url: '/api/medics/' + $scope.date.idMedic,
		params: {token: auth.getToken()}
	})
	.success(function(data) {
		if(!data) {
			$location.url('/404');
		}

		$scope.doctor = data;
	});
};