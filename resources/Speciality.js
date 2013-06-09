var models = db.models;
var model = models.Speciality;

/*
 * Index
 * @GET /api/services/
 * @returns list of records of service
 */
exports.index = function(request, response) {
	model.findAll(function(err,result){
		response.json(result);
	});
};


/*
 * Create
 * @POST /api/services/
 * @returns the newly created service
 */
exports.create = function(request, response){

	var infos = {
		name : request.body.name,
	}

	model.create(infos, function(err, result){ 
		if(err){
			response.json(400,err);
			return;
		}

		if(result == null){
			reponse.json(404, null);
		}

		response.json(result);

	});
};


/*
 * Show
 * @GET /api/services/:id
 * @returns the desired speciality
 */
exports.show = function(request, response) {
	model.find({id : request.params.speciality}, function(err,result){
		if(err){
			response.json(400,err);
			return;
		}

		if(result == null){
			response.json(404,null);
		}

		response.json(result);
	});
};


/*
 * Update
 * @PUT /api/services/:id
 * @returns the saved speciality
 */
exports.update = function(request, response){
	var infos = {
		name : request.body.name || null,
	};

	model.find({id : request.params.speciality}, function(err,result){
		if(err){
			response.json(400,err);
			return;
		}

		if(result == null){
			response.json(404,null);
			return;
		}

		result.set(infos);
		result.save(function(success){
			response.json({ success : success });
		});
		
	});
};


/*
 * Destroy
 * @DELETE /api/services/:id
 * @returns the success of the removal of the speciality
 */
exports.destroy = function(request, response){
	model.find({id : request.params.speciality}, function(err,result){
		if(err){
			response.json(400,err);
			return;
		}

		if(result == null){
			response.json(404,null);
			return
		}

		result.del(function(err){
			if(err){
				response.json(400,err);
				return;
			}

			response.json({success: true});

		});
	});
};