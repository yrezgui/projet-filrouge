var models = db.models;
var model = models.Patient;

/*
 * Login
 * @POST /api/patients/login
 * @returns the token and informations about the logged patient
 */
exports.login = function(req, res){
	var crypto = require('crypto'),
		sha1 = crypto.createHash('sha1');

	sha1.update(req.body.password);
	var password = sha1.digest('hex');

	model.find({email: req.body.email, password: password, active: 1 }, function(err, result){
		if(err){
			res.json(400, err);
			return;
		}

		if(result == null) {
			res.json(401, null);
			return;
		}

		models.Token.create(result.infos.idUser, 'patient', function(result){
			res.json({ token : result.token, id : result.idUser, type : 'patient'} );
		});
	});
};


/*
 * Index
 * @GET /api/patients/
 * @returns list of records of patients
 */
exports.index = function(req, res) {

	var get = [];

	switch(req.type) {

		case 'secretary':
			get = [
				'id',
				'firstname',
				'lastname',
				'birthdate',
				'gender'
			];
		break;

		case 'medic':
			get = [
				'id',
				'firstname',
				'lastname',
				'birthdate',
				'gender'
			];
			
		break;

		case 'admin':
			get = [
				'id',
				'firstname',
				'lastname',
				'birthdate',
				'gender'
			];
		break;
	}

	model.findAll(function (err, result){
		if(err) {
			res.json(400, err);
			return;		
		}

		result.forEach(function (value, index){
			result[index] = value.json(get);
		});

		res.json(result);
	});
};


/*
 * Create
 * @POST /api/patients/
 * @returns the newly created patient
 */
exports.create = function(req, res){

	var userinfo = {
		password : req.body.password,
		firstname : req.body.firstname,
		lastname : req.body.lastname,
		birthdate : req.body.birthdate,
		email : req.body.email,
		gender : req.body.gender,
	}

	var sha1		= require('crypto').createHash('sha1'),
		check		= require('validator').check,
		sanitize	= require('validator').sanitize;

	if(userinfo.password != null){
		sha1.update(userinfo.password);
		userinfo.password = sha1.digest('hex');
	}

	var validator = new Validator();

	if(userinfo.email != null){
		validator.check(userinfo.email, 'Rentrez un email valide').isEmail();
	}

	if(userinfo.birthdate != null){
		validator.check(userinfo.birthdate, 'Rentrez une date valide voyons!').regex("^[0-9]{4}[-][0-9]{1,2}[-][0-9]{1,2}$");
	}

	var errors = validator.getErrors();
	console.log(errors);

	if(errors && errors.length){
		res.json(400, errors);
		return;
	}

	model.create(userinfo, function(err, result){ 
		if(err != null) {
			res.json(400, err);
			return;
		}

		res.json(result);
	});
};


/*
 * Show
 * @GET /api/patients/:id
 * @returns the desired patient
 */
exports.show = function(req, res) {
	if(req.type == 'patient') {
		if(req.params.patient != req.id) {
			res.json(403, null);
			return;
		}
	}

	model.find({idUser: req.params.patient}, function(err, result){
		if(err != null) {
			res.json(400, err);
			return;
		}

		if(result == null) {
			res.json(404, null);
			return;
		}

		res.json(result);
	});
};


/*
 * Update
 * @PUT /api/patients/:id
 * @returns the saved patient
 */
exports.update = function(req, res){

	if(req.type == 'patient' && req.id != req.params.patient) {
		res.json(401, null);
		return;
	}

	var userinfo = {
		user : {
			password : req.body.password || null,
			firstname : req.body.firstname || null,
			lastname : req.body.lastname || null,
			birthdate : req.body.birthdate || null,
			email : req.body.email || null,
			gender : req.body.gender || null
		}
	};

	var crypto = require('crypto'),
		sha1 = crypto.createHash('sha1');
	var check = require('validator').check,
		sanitize = require('validator').sanitize;

	if(userinfo.user.password != null){
		sha1.update(userinfo.user.password);
		userinfo.user.password = sha1.digest('hex');
	}

	var validator = new Validator();

	if(userinfo.user.email != null){
		validator.check(userinfo.user.email, 'Rentrez un email valide').isEmail();
	}
	if(userinfo.user.birthdate != null){
		validator.check(userinfo.user.birthdate, 'Rentrez une date valide voyons!').regex("^[0-9]{4}[-](0[1-9]|1[012])[-](0[1-9]|[12][0-9]|3[01])$");
	}

	var errors = validator.getErrors();

	if(errors && errors.length){
		res.json(400,errors);
		return;
	}

	model.find({idUser : req.params.patient}, function(err, result){
		if(err != null){
			res.json(400, err);
			return;
		}

		result.set(userinfo);
		result.save(function(success){
			res.json({ success : success });
		});
	});
};

/*
 * Destroy
 * @DELETE /api/patients/:id
 * @returns the success of the removal of the patient
 */
exports.destroy = function(req, res){
	model.find({idUser : req.params.patient}, function(err, result){
		if(err != null){
			res.json(400, err);
			return;
		}

		if(result == null){
			res.json(404, null);
			return;
		}

		result.desactivate(function(err) {
			if(err != null){
				res.json(400, err);
				return;
			}
			
			res.json({success: true});
		});
	});
};