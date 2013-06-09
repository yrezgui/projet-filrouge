angular.module('site').directive('datepickerex', function() {
	return {
		require: 'ngModel',
		link: function (scope, element, attrs, ngModelCtrl) {

			setTimeout(function(){
				var input = element.find('input');
				console.log(ngModelCtrl.$viewValue);
	
				input.datepicker({
					changeMonth: true,
					changeYear: true,
					yearRange: '1901:',
					dateFormat: 'yy-mm-dd',
					defaultDate: new Date(ngModelCtrl.$viewValue),
					onSelect: function(dateText) {
						ngModelCtrl.$setViewValue(new Date(dateText));
						input.datepicker('close');
					}
				});
	
				input.datepicker( "setDate", "10/12/2012" );

				/*ngModelCtrl.$setViewValue(new Date());
				scope.$apply();*/
	
				element.find('a.picker').on('click', function(){
					input.datepicker('show');
				});
			}, 1000);
		}
	};
});


angular.module('site').directive('datepicker', function(calendar, $location) {
	return {
		restrict: 'A',
		scope: {
			model: '='
		},
		controller: function($scope) {
			var definedDate = calendar.parse($scope.model.format);

			$scope.calendar = calendar.generateCalendarArray(definedDate.getMonth(), definedDate.getFullYear());

			$scope.redirect = function redirect(url) {
				$location.url(url);
			};
		},
		templateUrl: '/tpl/directive/calendar.html'
	};
});

angular.module('site').directive('timepicker', function($http, auth, calendar, timetable, socket) {
	return {
		restrict: 'A',
		scope: {
			model: '='
		},
		controller: function($scope) {
			var definedDate = timetable.parse($scope.model.format);
			$scope.createOK = false;
			$scope.createNotOK = false;

			$scope.timetable = timetable.generateTimetableArray($scope.model.day, $scope.model.month, $scope.model.year);
			$scope.choosenSlot = angular.copy($scope.model);
			$scope.calendar = calendar;

			var socketChannel = $scope.choosenSlot.idMedic + '/' + $scope.model.year + ':' + $scope.model.month + ':' + $scope.model.day;

			socket.on('rdv', function (data) {

				if(data.channel !== socketChannel)
					return false;

				var hour = _.find($scope.timetable[data.partDay].slots, function(hour) {
					return hour.name == data.hour;
				});

				var slot = _.find(hour.quarters, function(quarter) {
					return quarter.name == data.quarter;
				});

				slot.status = data.status;
			});

			$scope.createRDV = function createRDV(hour, quarter, partDay) {
				
				$scope.choosenSlot.hour = hour;
				$scope.choosenSlot.quarter = quarter;
				$scope.choosenSlot.partDay = partDay;

				$('#modal-confirmation').modal('show');
			};

			$scope.confirmRDV = function confirmRDV() {
				$scope.choosenSlot.hour = $scope.choosenSlot.hour;
				$scope.choosenSlot.quarter = $scope.choosenSlot.quarter;

				$http({
					method: 'post',
					url: '/api/rendezvous',
					params: {token: auth.getToken()},
					data: {
						date: $scope.choosenSlot.year + '-' + $scope.choosenSlot.month + '-' + $scope.choosenSlot.day,
						hour: $scope.choosenSlot.hour + ':' + $scope.choosenSlot.quarter,
						medic: $scope.choosenSlot.idMedic,
						comment: $scope.choosenSlot.comment
					}
				})
				.success(function(data) {
					data = angular.fromJson(data);

					if(data) {
						$scope.createOK = true;
						$scope.createNotOK = false;

					}
					else {
						$scope.createOK = false;
						$scope.createNotOK = true;
					}

					socket.emit('rdv', {
						channel: socketChannel,
						partDay: $scope.choosenSlot.partDay,
						hour: $scope.choosenSlot.hour,
						quarter: $scope.choosenSlot.quarter,
						status: 'full'
					});

					$scope.choosenSlot.comment = '';
					$('#modal-confirmation').modal('hide');
				})
				.error(function(data) {

					$scope.createOK = false;
					$scope.createNotOK = true;

					$scope.choosenSlot.comment = '';
					$('#modal-confirmation').modal('hide');
				});
			};
		},
		templateUrl: '/tpl/directive/timepicker.html'
	};
});