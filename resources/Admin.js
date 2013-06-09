var models = db.models;
var model = models.Admin;

/*
 * Login
 * @POST /api/admins/login
 * @returns the token and informations about the logged admin
 */
exports.login = function(request, response){
	var crypto = require('crypto'),
		sha1 = crypto.createHash('sha1');

	sha1.update(request.body.password);
	var password = sha1.digest('hex');

	model.find({email : request.body.email, password : password }, function(err,result){
		if(err){
			response.json(400,err);
			return;
		}
		if(result == null){
			 response.json(401, null);
			 return;
		}

		models.Token.create(result.infos.idUser, 'admin', function(result){
			response.json({ token : result.token, id : result.idUser, type : 'admin' } );
		});
			
	});
};


/*
 * Index
 * @GET /api/admins/
 * @returns list of records of admins
 */
exports.index = function(request, response) {

	var	get = [
			'id',
			'firstname',
			'lastname',
			'birthdate',
			'email',
			'gender'
		];

	model.findAll(function (err,result){
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
 * @POST /api/admins/
 * @returns the newly created admin
 */
exports.create = function(request, response){

	var userinfo = {
		password : request.body.password,
		firstname : request.body.firstname,
		lastname : request.body.lastname,
		birthdate : request.body.birthdate,
		email : request.body.email,
		gender : request.body.gender,
	}

	var crypto = require('crypto'),
		sha1 = crypto.createHash('sha1');
	var check = require('validator').check,
		sanitize = require('validator').sanitize;

	if(userinfo.password != null){
		sha1.update(userinfo.password);
		userinfo.password = sha1.digest('hex');
	}

	var validator = new Validator();

	if(userinfo.email != null){
		validator.check(userinfo.email, 'Rentrez un email valide').isEmail();
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
			if(err != null) response.json(400,err);
			else{
				response.json(result);
			}
		});
	}
};


/*
 * Show
 * @GET /api/admins/:id
 * @returns the desired admin
 */
exports.show = function(request, response) {

	var	get = [
			'id',
			'firstname',
			'lastname',
			'birthdate',
			'email',
			'gender'
		];

	model.find({idUser : request.params.admin}, function(err,result){
		if(err != null){
			response.json(400,err);
			return;
		}

		if(result == null){
			response.json(404, null);
			return;
		}

		response.json(result.json(get));
	});
};


/*
 * Update
 * @PUT /api/admins/:id
 * @returns the saved admin
 */
exports.update = function(request, response){
	var userinfo = {
		user : {
			password : request.body.password || null,
			firstname : request.body.firstname || null,
			lastname : request.body.lastname || null,
			birthdate : request.body.birthdate || null,
			email : request.body.email || null,
			gender : request.body.gender || null
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
		response.json(400,errors);
		return;
	}

	model.find({idUser : request.params.admin}, function(err,result){
		if(err != null){
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
 * @DELETE /api/admins/:id
 * @returns the success of the removal of the admin
 */
exports.destroy = function(request, response){
	model.find({idUser : request.params.admin}, function(err,result){
		if(err != null){
			response.json(400,err);
			return;
		}

		if(result == null){
			response.json(404,null);
			return;
		}
		
		result.desactivate(function(err){
			if(err != null){
				response.json(400,err);
				return;
			}

			response.json({success: true});
		});
	});
};