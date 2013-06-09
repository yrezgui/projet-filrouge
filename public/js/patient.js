var signupCtrl = function signupCtrl($scope, $http, errorManager) {

	$scope.error = '';
	$scope.success = '';

	$scope.email = '';
	$scope.password = '';
	$scope.sendButton = 'Inscription';
	$scope.sendButtonDisabled = false;

	$scope.days = _.range(1, 31 + 1, 1);
	$scope.years = _.range(1900, new Date().getFullYear() + 1, 1);

	$scope.signup = function(){

		$scope.sendButton = 'Envoi en cours';
		$scope.sendButtonDisabled = true;

		$http({
			method: 'post',
			url: '/api/patients/',
			data: {
				email: $scope.email,
				password: $scope.password,
				firstname: $scope.firstname,
				lastname: $scope.lastname,
				gender: $scope.gender,
				birthdate: $scope.year + '-' + $scope.month + '-' + $scope.day
			}
		})
		.success(function(data) {
			$scope.success = 'Bravo! Votre inscription a bien été enregistrer.';
			$scope.error = '';
			$scope.sendButton = 'Redirection en cours';
			$scope.sendButtonDisabled = true;
		})
		.error(function(data, httpCode) {

			$scope.error = errorManager.http(data, httpCode, false);
			$scope.sendButton = 'Inscription';
			$scope.sendButtonDisabled = false;
		});
	}
};

var patientHomeCtrl = function patientHomeCtrl($scope, $http, auth) {

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