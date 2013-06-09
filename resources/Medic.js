var models = db.models;
var model = models.Medic;

/*
 * Login
 * @POST /api/medics/login
 * @returns the token and informations about the logged medic
 */
exports.login = function(request, response){
	var crypto = require('crypto'),
		sha1 = crypto.createHash('sha1');

	sha1.update(request.body.password);
	var password = sha1.digest('hex');

	model.find({email : request.body.email, password : password }, function(err,result){
		if(err){
			response.json(400,err);
		}
		else{
			if(result == null)
				 response.json(401, null);
			else{
				models.Token.create(result.infos.idUser, 'medic', function(result){
					response.json({token : result.token, id : result.idUser, type : 'medic'} );
				});
			}
		}
	})
};


/*
 * Index
 * @GET /api/medics/
 * @returns JSON list of records of medics
 */
exports.index = function(request, response) {

	var get = [];
	console.log(request.type);

	switch(request.type) {
		case 'admin':
			get = [
				'id',
				'firstname',
				'lastname',
				'birthdate',
				'email',
				'gender',
				'idUser',
				'idService',
				'idSpeciality',
				'name'
			];
		break;

		case 'secretary':
			get = [
				'id',
				'firstname',
				'lastname',
				'gender',
				'idUser',
				'idService',
				'idSpeciality',
				'name'
			];
		break;

		case 'medic':
			get = [
				'id',
				'firstname',
				'lastname',
				'gender',
				'idUser',
				'idService',
				'idSpeciality',
				'name'
			];
		break;

		case 'patient':
			get = [
				'id',
				'firstname',
				'lastname',
				'gender',
				'idUser',
				'idService',
				'idSpeciality',
				'name'
			];
		break;
	}

	model.findAll(function (err, result){
		if(err)
			response.json(err);

		result.forEach(function (value, index){
			result[index] = value.json(get);
		});

		response.json(result);
	});

};

/*
 * Create
 * @POST /api/medics/
 * @returns the newly created medic
 */
exports.create = function(request, response){

	if(request.body.service  == null) response.json(400, null);
	if(request.body.speciality == null) response.json(400, null);
	
	var userinfo = {
		user : {
			password : request.body.password,
			firstname : request.body.firstname,
			lastname : request.body.lastname,
			birthdate : request.body.birthdate,
			email : request.body.email,
			gender : request.body.gender
		},
		service : request.body.service,
		speciality : request.body.speciality,
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
	console.log(errors);

	if(errors && errors.length){
		response.json(400,errors);
	}
	else{
		model.create(userinfo, function(err, result){ 
			if(err != null) 
				response.json(400,err);
			else
				response.json(result);
		});
	}

};

/*
 * Show
 * @GET /api/medics/:id
 * @returns the desired medic
 */
exports.show = function(request, response) {
	
	switch(request.type) {
		case 'admin':
			get = [
				'id',
				'firstname',
				'lastname',
				'birthdate',
				'email',
				'gender',
				'idUser',
				'idService',
				'idSpeciality',
				'name'
			];
		break;

		case 'secretary':
		case 'medic':
		case 'patient':
			get = [
				'id',
				'firstname',
				'lastname',
				'gender',
				'idUser',
				'idService',
				'idSpeciality',
				'name'
			];
		break;
	}

	var infos = {
		idUser : request.params.medic,
	};

	model.find(infos, function(err,result){
		if(result == null)
			response.json(404,null);
		else
			response.json(result.json(get));
	});
};

/*
 * Update
 * @PUT /api/medics/:id
 * @returns the saved medic
 */
exports.update = function(request, response){

	if(request.type == 'medic' && request.params.medic != request.id){
		response.json(403,null);
		return;
	}

	var userinfo = {
		user : {
			password : request.body.password || null,
			firstname : request.body.firstname || null,
			lastname : request.body.lastname || null,
			birthdate : request.body.birthdate || null,
			email : request.body.email || null,
			gender : request.body.gender || null
		},
		idService : request.body.service || null,
		idSpeciality : request.body.speciality || null,
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
		response.json(400,errors);
		return;
	}

	model.find({idUser : request.params.medic}, function(err,result){
		if(err){
			response.json(400,err);
			return;
		}

		if(result == null){
			response.json(404,null);
			return;
		}

		result.set(userinfo);
		result.save(function(success){
			response.json({ success : success });
		});
		
	});
};

/*
 * Destroy
 * @DELETE /api/medics/:id
 * @returns the success of the removal of the medic
 */                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
exports.destroy = function(request, response){
	
	if(request.type == 'medic' && request.params.medic != request.id){
		response.json(403,null);
		return;
	}

	model.find({idUser : request.params.medic}, function(err,result){
		if(err){
			response.json(400,err);
			return;
		}

		if(result == null){
			response.json(404,null);
			return;
		}

		result.desactivate(function(err){
			if(err){
				response.json(400,err);
				return;
			}
			response.json({success: true});
		});
	});
};