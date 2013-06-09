var models = db.models;
var model = models.Secretary;

/*
 * Login
 * @POST /api/secretaries/login
 * @returns the token and informations about the logged medic
 */
exports.login = function(req, res){
	var crypto = require('crypto'),
		sha1 = crypto.createHash('sha1');

	sha1.update(req.body.password);
	var password = sha1.digest('hex');

	model.find({email : req.body.email, password : password, active : 1 }, function(err,result){
		if(err){
			res.json(400,err);
		}
		else{
			if(result == null)
				 res.json(401, null);
			else{
				models.Token.create(result.infos.idUser, 'secretary', function(result){
					res.json({token : result.token, id : result.idUser, type : 'secretary'});
				});
			}
		}
	})
};


/*
 * Index
 * @GET /api/secretaries/
 * @returns list of records of secretaries
 */
exports.index = function(req, res) {

	var get = [];
	get = [
		'id',
		'firstname',
		'lastname',
		'birthdate',
		'email',
		'gender'
	];
	

	model.findAll(function (err, result){
		if(err)
			res.json(err);

		result.forEach(function (value, index){
			result[index] = value.json(get);
		});

		res.json(result);
	});
};

/*
 * Create
 * @POST /api/secretaries/
 * @returns the newly created secretary
 */
exports.create = function(req, res){
	
	var userinfo = {
		user : {
			password : req.body.password,
			firstname : req.body.firstname,
			lastname : req.body.lastname,
			birthdate : req.body.birthdate,
			email : req.body.email,
			gender : req.body.gender
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
	console.log(errors);

	if(errors && errors.length){
		res.json(400,errors);
	}
	else{
		model.create(userinfo, function(err, result){ 
			if(err != null) 
				res.json(400,err);
			else
				res.json(result);
		});
	}

};

/*
 * Show
 * @GET /api/secretaries/:secretary
 * @returns the desired secretary
 */
exports.show = function(req, res) {
	if(req.type == 'secretary' && req.id != req.params.secretary) {
		res.json(401, null);
		return;
	}


	var infos = {
		idUser : req.params.secretary,
	};

	model.find(infos, function(err,result){
		if(result == null) {
			res.json(404,null);
			return;
		}
		
		result.user.infos = _.omit(result.user.infos, 'password');
		res.json(result);
	});
};

/*
 * Update
 * @PUT /api/secretaries/:id
 * @returns the saved secretary
 */
exports.update = function(req, res){

	if(req.type == 'secretary' && req.id != req.params.secretary) {
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

	model.find({idUser : req.params.secretary}, function(err,result){
		if(err != null){
			res.json(400,err);
		}
		else{
			result.set(userinfo);
			result.save(function(success){
				res.json({ success : success });
			});
		}
		
	});
};

/*
 * Destroy
 * @DELETE /api/secretaries/:id
 * @returns the success of the removal of the secretary
 */
exports.destroy = function(req, res){

	if(req.type == 'secretary' && req.id != req.params.secretary) {
		res.json(401, null);
		return;
	}


	model.find({idUser : req.params.secretary}, function(err,result){
		if(err != null){
			res.json(400,err);
		}
		else{
			if(result == null){
				res.json(404,null);
			}
			else{
				result.desactivate(function(err){
					if(err != null){
						res.json(400,err);
					}
					else{
						res.json({success: true});
					}
				});
			}
		}
	});
};