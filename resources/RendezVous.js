var models = db.models;
var model = models.RendezVous;
var Token = models.Token;



exports.index = function(request, response) {
	if(request.type = "medic"){
		model.findAll({idMedic : request.id }, function(err,result){
			if(err != null) response.json(404,err);
			else response.json(result);
		});
	}
	else{
		response.json(401,null);
	}
};

exports.create = function(request, response){

	if(request.body.date  == null) response.json(400, null);
	if(request.body.hour == null) response.json(400, null);

	var data = {
		idPatient : null,
		idMedic : null,
		date : request.body.date,
		timetable : request.body.hour,
		comment : request.body.comment || null
	};

	switch(request.type) {

		case 'secretary':
			if(request.body.patient  == null) response.json(400, null);
			if(request.body.medic == null) response.json(400, null);

			data.idPatient = request.body.patient;
			data.idMedic = request.body.medic;

		break;

		case 'medic':
			if(request.body.patient  == null) response.json(400, null);
			data.idPatient = request.body.patient;
			data.idMedic = request.id;

		break;

		case 'patient':
			if(request.body.medic == null) response.json(400, null);
			data.idPatient = request.id;
			data.idMedic = request.body.medic;
		break;
	}

	get = [
		'id',
		'firstname',
		'lastname',
		'gender',
		'idUser',
		'idService',
		'idSpeciality',
		'name',
		'date',
		'timetable',
		'comment'
	];

	var validator = new Validator();
	
	if(data.date != null){
		validator.check(data.date, 'Rentrez une date valide voyons!').regex("^[0-9]{4}[-](0[1-9]|1[012])[-](0[1-9]|[12][0-9]|3[01])$");
	}

	model.create(data, function(err, result){ 
		if(err != null) 
			response.json(400,err);
		else if (result == null)
			response.json(400, null);
		else
			response.json(result.json(get));
	});
}

exports.count = function(request, response){

	if(request.query.month != null && request.query.year != null){
		more = {
			day : null,
			hour : null,
			idMedic : null,
		};
		if(request.query.day != null){
			more.day = request.query.day;
		}

		if(request.query.hour != null){
			more.hour = request.query.hour;
		}

		if(request.query.idMedic){
			more.idMedic = request.query.idMedic;
		}

		model.count(request.query.month, request.query.year, more,  function(err, result){
			if(err != null){
				response.json(400, err);
				return;
			}

			if(result == null){
				response.json(404, null);
			}

			response.json(result);
		});

	}
	else{
		response.json(400, null)
	}
}

