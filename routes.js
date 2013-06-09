/**
 * Resource Routes
 */

var token_validator = function token_validator(role) {
	return function(req, res, next) {
		var token = req.query.token;
		console.log(token);
		
		if(!token){
			res.send(403, null);
			return;
		}

		db.models.Token.isValid(token, function(user){

			if(user == null) {
				res.send(401, null);
				return;
			}

			if(!_.isArray(role)) {
				res.send(403, null);
				return;
			}

			
			if(role.indexOf(user.type) == -1) {
				res.send(403, null);
				return;
			}

			req.id = user.idUser;
			req.type = user.type;

			next();
		});
	}
};

module.exports = function() {

	//User
	var user = require('./resources/User');
	app.post('/api/users/login', user.login);

	//Patient
	var patient = require('./resources/Patient');

	app.get('/api/patients', token_validator(['admin', 'secretary', 'medic']), patient.index);
	app.post('/api/patients', patient.create);
	app.get('/api/patients/:patient', token_validator(['admin', 'secretary', 'medic', 'patient']), patient.show);
	app.put('/api/patients/:patient', token_validator(['admin', 'secretary', 'medic', 'patient']), patient.update);
	app.delete('/api/patients/:patient', token_validator(['admin', 'medic', 'secretary', 'patient']), patient.destroy);


	//Secretary
	var secretary = require('./resources/Secretary');

	app.get('/api/secretaries', token_validator(['admin']), secretary.index);
	app.post('/api/secretaries', token_validator(['admin']), secretary.create);
	app.get('/api/secretaries/:secretary', token_validator(['admin', 'secretary']), secretary.show);
	app.put('/api/secretaries/:secretary', token_validator(['admin', 'secretary']), secretary.update);
	app.delete('/api/secretaries/:secretary', token_validator(['admin', 'secretary']), secretary.destroy);

	//Medic
	var medic = require('./resources/Medic');

	app.get('/api/medics', token_validator(['admin', 'secretary', 'medic', 'patient']), medic.index);
	app.post('/api/medics', token_validator(['admin']), medic.create);
	app.get('/api/medics/:medic', token_validator(['admin', 'secretary', 'medic', 'patient']), medic.show);
	app.put('/api/medics/:medic', token_validator(['admin', 'medic']), medic.update);
	app.delete('/api/medics/:medic', token_validator(['admin', 'medic']), medic.destroy);
	

	//Service
	var service = require('./resources/Service');

	app.get('/api/services', token_validator(['admin', 'secretary', 'medic', 'patient']), service.index);
	app.post('/api/services', token_validator(['admin']), service.create);
	app.get('/api/services/:service', token_validator(['admin', 'secretary', 'medic', 'patient']), service.show);
	app.put('/api/services/:service', token_validator(['admin']), service.update);
	app.delete('/api/services/:service', token_validator(['admin']), service.destroy);


	//Speciality
	var speciality = require('./resources/Speciality');

	app.get('/api/specialities', token_validator(['admin', 'secretary', 'medic', 'patient']), speciality.index);
	app.post('/api/specialities', token_validator(['admin']), speciality.create);
	app.get('/api/specialities/:speciality', token_validator(['admin', 'secretary', 'medic', 'patient']), speciality.show);
	app.put('/api/specialities/:speciality', token_validator(['admin']), speciality.update);
	app.delete('/api/specialities/:speciality', token_validator(['admin']), speciality.destroy);


	//RendezVous
	var rendezvous = require('./resources/RendezVous');

	app.get('/api/rendezvous', token_validator(['admin', 'secretary', 'medic', 'patient']), rendezvous.index);
	app.post('/api/rendezvous', token_validator(['secretary', 'medic', 'patient']), rendezvous.create);
	app.get('/api/rendezvous/count', token_validator(['secretary', 'medic', 'patient', 'admin']), rendezvous.count);
	app.get('/api/rendezvous/count/:month/:year', token_validator(['secretary', 'medic', 'patient', 'admin']), rendezvous.count);
	// app.get('/api/rendezvous/:rendezvous', token_validator(['admin', 'secretary', 'medic', 'patient']), rendezvous.show);
	// app.put('/api/rendezvous/:rendezvous', token_validator(['secretary', 'medic']), rendezvous.update);
	// app.delete('/api/rendezvous/:rendezvous', token_validator(['secretary', 'medic', 'patient']), rendezvous.destroy);


	//Admin
	var admin = require('./resources/Admin');

	app.get('/api/admins', token_validator(['admin']), admin.index);
	app.post('/api/admins', token_validator(['admin']), admin.create);
	app.get('/api/admins/:admin', token_validator(['admin']), admin.show);
	app.put('/api/admins/:admin', token_validator(['admin']), admin.update);
	app.delete('/api/admins/:admin', token_validator(['admin']), admin.destroy);
};