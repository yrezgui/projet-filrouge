var mainCtrl = function mainCtrl($scope, $location, auth) {
	$scope.auth = auth;
	$scope.$location = $location;
};

var pageCtrl = function pageCtrl() {

};

var notFoundCtrl = function notFoundCtrl() {

};

var logoutCtrl = function logoutCtrl($scope, $http, $location, auth) {
	auth.logout();
	$location.url('/connexion');
};

var loginCtrl = function loginCtrl($scope, $http, $location, errorManager, auth) {
	$scope.error = '';
	$scope.success = '';

	$scope.email = '';
	$scope.password = '';
	$scope.sendButton = 'Connexion';
	$scope.sendButtonDisabled = false;

	$scope.login = function(){

		$scope.sendButton = 'Envoi en cours';
		$scope.sendButtonDisabled = true;

		$http({
			method: 'post',
			url: '/api/users/login',
			data: {
				email: $scope.email,
				password: $scope.password
			}
		})
		.success(function(data) {
			$scope.success = 'Vous êtes bien connecté, vous allez être redirigé vers votre espace dans quelques instants';
			$scope.error = '';
			$scope.sendButton = 'Redirection en cours';
			$scope.sendButtonDisabled = true;

			auth.set(data.id, data.token, data.type);

			$location.url('/' + data.type + 's');
		})
		.error(function(data, httpCode) {
			$scope.error = errorManager.http(data, httpCode, true);
			$scope.sendButton = 'Connexion';
			$scope.sendButtonDisabled = false;
		});
	}
};