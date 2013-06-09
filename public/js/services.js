site.factory('errorManager', function() {
	var instance = {};

	instance.http = function http(data, status, login){
		switch (status) {
			case 401:
				if(login)
					return 'Email ou mot de passe incorrect.';
				else
					return 'Vous n\'êtes pas autorisé à accéder à cette page.';
				break;

			case 400:
				return 'Certains champs contiennent des erreurs.';
				break;

			case 500:
				return 'Le serveur rencontre quelques petits problèmes. Veuillez réessayer plus tard.';
				break;
		}
	};

	return instance;
});

site.factory('auth', function($location, $cookieStore, $http, $rootScope) {
	var instance = {};
	var user = null;

	if($cookieStore.get('session')) {
		user = angular.fromJson($cookieStore.get('session'));
	}

	instance.set = function(id, token, type) {
		user = {
			id: id,
			token: token,
			type: type
		};

		$cookieStore.put('session', angular.toJson(user));
		$rootScope.$broadcast('connected'); 
	};

	instance.getUser = function getUser() {
		return user;
	};

	instance.getId = function getId() {
		return user.id;
	};

	instance.getToken = function getToken() {
		return user.token;
	};

	instance.getType = function getType() {
		return user ? user.type : null;
	};

	instance.isConnected = function isConnected() {
		return user ? true : false;
	};

	instance.verify = function verify() {
		if(!instance.isConnected()) {
			$location.url('/connexion');
			return false;
		}
		else {
			return true;
		}
	};

	instance.logout = function logout() {
		$cookieStore.remove('session');
		user = null;
		$rootScope.$broadcast('disconnected'); 
	};

	return instance;
});

site.factory('calendar', function() {
	// these are the days of the week for each month, in order
	var _daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	// these are human-readable month name labels, in order
	var _labelMonths = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', '	Septembre', 'Octobre', 'Novembre', 'Décembre'];
	// these are human-readable month name labels, in order
	var _labelDays = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

	return {
		daysPerMonth: function daysPerMonth() {
			return _daysPerMonth;
		},
		labelMonths: function labelMonths() {
			return _labelMonths;
		},
		labelDays: function labelDays() {
			return _labelDays;
		},
		getLabelDay: function getLabelDay(day) {
			return _labelDays[day] || null;
		},
		getLabelMonth: function getLabelMonth(monthNumber) {
			if(!_labelMonths[monthNumber - 1])
				return null;

			return _labelMonths[monthNumber - 1];
		},
		generateCalendarArray: function generateCalendarArray(month, year) {
			// get first day of month
			var firstDay = new Date(year, month, 1);
			var startingDay = firstDay.getDay();
			
			// find number of days in month
			var monthLength = _daysPerMonth[month];
			
			// compensate for leap year
			if (month == 1) { // February only!
				if((this.year % 4 === 0 && year % 100 !== 0) || year % 400 === 0){
					monthLength = 29;
				}
			}

			var weeks = [[]];
			var currentWeek = 0;

			// fill in the days
			var day = 1;
			// this loop is for is weeks (rows)
			for (var i = 0; i < 9; i++) {
				// this loop is for weekdays (cells)
				for (var j = 0; j <= 6; j++) { 
					if (day <= monthLength && (i > 0 || j >= startingDay)) {
						weeks[currentWeek].push({
							number: day,
							count: Math.floor(Math.random() * 33),
							// when day === sunday ( sun === 0)
							status: j === 0 ? 'weekend' : 'normal'
						});

						day++;
					}
					else {
						weeks[currentWeek].push({
							number: -1,
							status: 'out'
						});
					}
				}
				// stop making rows if we've run out of days
				if (day > monthLength) {
					break;
				} else {
					weeks.push([]);
					currentWeek++;
				}
			}
			return {
				year: year,
				month: month + 1,
				weeks: weeks
			};
		},
		parse: function parser(str) {
			var reg = new RegExp(/^([0-9]{2,4})-([0-9]{1,2})-([0-9]{1,2})$/);

			if(!reg.test(str) || str === '0000-00-00')
				return null;

			var dateSplited = str.split('-');

			return new Date(dateSplited[0], parseInt(dateSplited[1]) - 1, dateSplited[2]);
		},
		encodeFromDate: function encodeFromDate(date) {
			if(!date instanceof Date) {
				return null;
			}

			return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
		},
		encodeFromString: function encodeFromString(year, month, day) {
			if(!day) {
				day = 1;
			}

			return year + '-' + month + '-' + day;
		}
	};
});

var socket;

site.factory('socket', function ($rootScope) {
	socket = io.connect();

	return {
		join: function join(room) {
			socket.join('room');
		},
		leave: function leave(room) {
			socket.leave('room');
		},
		on: function on(eventName, callback) {
			socket.on(eventName, function () {  
				var args = arguments;
				$rootScope.$apply(function () {
					callback.apply(socket, args);
				});
			});
		},
		emit: function emit(eventName, data, callback) {
			socket.emit(eventName, data, function () {
				var args = arguments;
				$rootScope.$apply(function () {
					if (callback) {
						callback.apply(socket, args);
					}
				});
			})
		}
	};
});

site.factory('timetable', function ($rootScope) {
	var _hoursDay = [[8, 9, 10, 11], [13, 14, 15, 16]];

	var _labelHoursDay = ['Matin', 'Après-midi'];

	var _quartersHour = ['00', '15', '30', '45'];

	return {
		hoursDay: function hoursDay() {
			return _partsDay;
		},
		quartersHour: function quartersHour() {
			return _partsHour;
		},
		labelHoursDay: function labelHoursDay() {
			return _labelHoursDay;
		},
		getlabelPartsDays: function getlabelPartsDays(partDayNumber) {
			if(!_labelHoursDay[partDayNumber])
				return null;

			return _labelHoursDay[partDayNumber];
		},
		generateTimetableArray: function generateTimetableArray(day, month, year) {
			var day = [];

			for(var i = 0; i < _hoursDay.length; i++) {
				day[i] = {
					index: i,
					label: _labelHoursDay[i],
					slots: {}
				};

				for(var j in _hoursDay[i]) {
					day[i].slots[j] = {
						name: _hoursDay[i][j],
						quarters: {}
					}

					for(var k in _quartersHour) {
						day[i].slots[j].quarters[k] = {
							name: _quartersHour[k],
							status: 'normal'
						}
					}
				}
			}
			
			return day;
		},
		parse: function parser(str) {
			var reg = new RegExp(/^([0-9]{2,4})-([0-9]{1,2})-([0-9]{1,2})$/);

			if(!reg.test(str) || str === '0000-00-00')
				return null;

			var dateSplited = str.split('-');

			return new Date(dateSplited[0], parseInt(dateSplited[1]) - 1, dateSplited[2]);
		},
		encodeFromDate: function encodeFromDate(date) {
			if(!date instanceof Date) {
				return null;
			}

			return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
		},
		encodeFromString: function encodeFromString(year, month, day) {
			if(!day) {
				day = 1;
			}

			return year + '-' + month + '-' + day;
		}
	};
});