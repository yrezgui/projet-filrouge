var site = angular.module('site', ['ngCookies']).config(function($routeProvider, $httpProvider) {
	$routeProvider
	.when('/', {
		controller: pageCtrl,
		templateUrl: '/tpl/index.html'
	})
	.when('/a-propos', {
		controller: pageCtrl,
		templateUrl: '/tpl/about.html'
	})
	.when('/connexion', {
		controller: loginCtrl,
		templateUrl: '/tpl/login.html'
	})
	.when('/deconnexion', {
		controller: logoutCtrl,
		templateUrl: '/tpl/login.html'
	})


	.when('/inscription', {
		controller: signupCtrl,
		templateUrl:'/tpl/patient/signup.html'
	})
	.when('/patients', {
		controller: patientHomeCtrl,
		templateUrl: 'tpl/patient/home.html'
	})


	.when('/rdv', {
		controller: rdvHomeCtrl,
		templateUrl: 'tpl/rdv/index.html'
	})
	.when('/rdv/:id', {
		controller: rdvDetailCtrl,
		templateUrl: 'tpl/rdv/index.html'
	})
	.when('/rdv/list/:idMedic/:year/:month', {
		controller: rdvListMonthCtrl,
		templateUrl: 'tpl/rdv/listMonth.html'
	})
	.when('/rdv/list/:idMedic/:year/:month/:day', {
		controller: rdvListDayCtrl,
		templateUrl: 'tpl/rdv/listDay.html'
	})


	.when('/medics', {
		controller: medicHomeCtrl,
		templateUrl: 'tpl/medic/home.html'
	})


	.when('/admins', {
		controller: adminHomeCtrl,
		templateUrl: 'tpl/admin/home.html'
	})
	.when('/admins/:type/edit/:id', {
		controller: adminEditCtrl,
		templateUrl: 'tpl/admin/edit_all.html'
	})

	.when('/404', {
		controller: notFoundCtrl,
		templateUrl: 'tpl/404.html'
	})


	.otherwise({
		redirectTo:'/'
	});
});