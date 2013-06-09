/**
 * Database Connection
 */
module.exports = function(options) {
	var database = {
		options: options
	};

	var mysql		= require('mysql');
	database.module	= mysql;
	database.client	= mysql.createConnection(database.options);

	database.models = {
		User			: require('./models/User'),
		Patient			: require('./models/Patient'),
		Medic			: require('./models/Medic'),
		Service			: require('./models/Service'),
		Speciality		: require('./models/Speciality'),
		Token			: require('./models/Token'),
		Admin			: require('./models/Admin'),
		RendezVous		: require('./models/RendezVous'),
		Secretary		: require('./models/Secretary')
	};

	return database;
};