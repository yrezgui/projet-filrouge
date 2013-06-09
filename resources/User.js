var models = db.models;
var model = models.User;

exports.index = function(request, response) {
	model.findAll(function(err,result){
		if(err != null) response.json(err);
		else response.json(result);
	});
};

exports.show = function(request, response) {
	model.find({id : request.params.user}, function(err,result){
		response.json(result);
	});
};

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


	sha1.update(userinfo.password);
	userinfo.password = sha1.digest('hex');

	var validator = new Validator();
	validator.check(userinfo.email, 'Rentrez un email valide').isEmail();

	var errors = validator.getErrors();
	console.log(errors);

	if(errors != null){
		response.json(400,errors);
	}
	else{
		model.create(userinfo, function(err, result){ 
			if(err != null) response.json(400,err);
			else{
				if(result == null)
					response.json(401, null);
				else
					response.json(result);
			}
		});
	}
};

exports.show = function(request, response) {
	model.find({id : request.params.user}, function(err,result){
		response.json(result);
	});
};

/*
 * Login
 * @POST /api/users/login
 * @returns the token and informations about the logged users
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
				model.getType(result.infos.id, function(err, res_type){
					console.log(err, res_type[0].type);
					if(err){
						response.json(400, err);
						return;
					}

					if(res_type == null || res_type[0] == null){
						response.json(404, null);
						return;
					}

					models.Token.create(result.infos.id, res_type[0].type, function(result){
						response.json({token : result.token, id : result.idUser, type : res_type[0].type } );
					});

				})
				
			}
		}
	})
};