var medicHomeCtrl = function medicHomeCtrl($scope, $http, auth) {

	if(!auth.verify())
		return;

	$scope.rendezvous = [];
	$http({
		method: 'get',
		url: '/api/rendezvous/',
		params: {token: auth.getToken()}
	})
	.success(function(data) {
		$scope.rendezvous = data;
	});
};