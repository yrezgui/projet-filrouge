/**
table à utiliser pour cette classe
@private
@property table 
@type String
@default "rendezvous"
**/
var table = 'rendezvous';

/**
@class RendezVous
@constructor
@param {Object}infos 
**/
var RendezVous = function User(infos){
	console.log(infos);
	var params = {
		id : '',
		idPatient : '',
		idMedic : '',
		date : '',
		timetable : '',
		comment: ''
	};

	for(var i in infos){
		if(params.hasOwnProperty(i)){
			params[i] = infos[i];
		}
	}

	/**
	Objet contenant les informations d'un rendez-vous
	@property infos 
	@type Object
	@default "{
		id : '',
		idPatient : '',
		idMedic : '',
		date : '',
		timetable : '',
		comment: ''
	}"
	**/
	this.infos = params;
	this.patient = null;
	this.medic = null;
};

//Methodes de classe

/**
Rechercher les rendez-vous correspondant aux données recherchées (infos) 
et appelle la callback donnée (callback)
@method findAll 
@static
@param {Object}infos Les informations à rechercher,
@param {function(err, result)}callback Callback à executer.
@return appel de la callback avec soit les erreurs soit un tableau d'object RendezVous correspondant à la recherche
@example
	//Afficher la liste des rendez-vous commençant à 08h00:
	RendezVous.findAll({timetable:'08:00'}, function(err, result){
		if(err != null)
			return false;

		return result;
	});
**/
RendezVous.findAll = function findAll(infos, callback){
	var sql = 'SELECT * FROM ' + table + ' WHERE ?';

	var query = db.client.query(sql, infos,  function(err, result) {
		var objs = [];
		if(err) {
			callback(err, null);	
		}
		else {
			for(var i in result){
				objs.push(new RendezVous(result[i]));
			}
			callback(null, objs);
		}
	});
	console.log('Executing : ' + query.sql);
};

RendezVous.count = function count(mois, annees, more, callback){
	var where = " MONTH(date) = "+mois+" AND YEAR(date) =" + annees ;
	var select = "DAYOFMONTH(date) as day, ";
	var groupby = "day";

	if(more != null && (more.day != null || more.hour != null) ){
		select += " HOUR(timetable) as hour, ";
		groupby += ",hour";

		if(more.day != null){
			where += " AND DAYOFMONTH(date) = " + more.day;
		}

		if(more.hour != null){
			where += " AND HOUR(timetable) = '" + more.hour + "'";
			select += " MINUTE(timetable) as minute, ";
			groupby += ",minute";
		}

		if(more.idMedic != null){
			where += " AND idMedic = '" + more.idMedic + "'";
		}

	}
	
	var sql = "select "+ select +" count(*) as total from " + table + " where " + where + ' group by ' + groupby;
	var query = db.client.query(sql, function(err,result){
		if(err != null){
			callback(err, null);
			return;
		}

		if(result[0] == null){
			callback(null, null);
			return;
		}

		callback(null, result);
		

	});
}

/**
Recherche un rendez-vous correspondant aux données recherchées (infos) 
et appel la callback donnée (callback)
@method find
@static
@param {Object} infos Les informations à rechercher,
@param {function} callback Callback à executer
@return appel de la callback avec soit les erreurs soit un object RendezVous correspondant à la recherche
**/
RendezVous.find = function find(infos, callback){
	var where = '1';
	for(var i in infos){
		where += " AND " + i + "='" +infos[i] + "'";
	}

	var query = db.client.query('SELECT * FROM ' + table + ' WHERE '+where+' LIMIT 1', function(err, result) {
		if(err) {
			callback(err, null);	
		}
		else {
			var obj = new RendezVous(result[0]);
			db.models.Medic.find({ idUser : obj.infos.idMedic}, function(err, result){
				if(err != null){
					callback(err, null);
					return;
				}

				obj.medic = result;
				db.models.Patient.find({ idUser : obj.infos.idPatient}, function(err, result){
					if(err != null){
						callback(err, null);
						return;
					}
					obj.patient = result;
					callback(null, obj);
				});
			});

		}
	});

};


/**
Permet d'inserer un nouveau rendez-vous dans la base de données
@method create
@static
@param {Object} infos infos pour la creation du rendez-vous
@param {function(err,result)} callback callback appelée par la fonction à la fin de l'insertion
@return appelle la callback avec soit les erreurs soit un object RendezVous correspondant au nouveau rendez-vous inseré
@example
	// Creer un nouveau rendez-vous et retourner true ou false
	User.create({
		idPatient : 52,
		idMedic : 1,
		date : "2013-05-02",
		timetable : "08:00:00",
		gender : "male",
		},
	function(err,result){
		if(err != null){
			response.json({success : true});
		}
		else{
			response.json({success : false});
		}
	})
**/
RendezVous.create = function create(infos,callback){
	var q = db.client.createQueue();

	console.log(infos);

	q.query("CALL createRendezVous(@id, ?, ?, ?, ?, ?)", [infos.idPatient, infos.idMedic, infos.date, infos.timetable, infos.comment]);

	q.query('SELECT @id as id', function(err, result){

		result = result[0];

		if(err != null || result.id == null){
			callback(err, null);
			return;
		}

		var test = null;

		db.models.RendezVous.find({ id : result.id }, function(err, result){
			if(err != null) {
				callback(err, null);
				return;
			}
			
			callback(null, result);
		});
	});


	q.execute();
};

/**
Retourne une ou plusieurs propriétés demandés (what) du rendez-vous
@method json
@param infos {String|Object} Les propriétés demandées
@return La ou les propriétés demandées
**/
RendezVous.prototype.json = function json(what){
	var json = {};

	for(var i in what){
		if(this.infos.hasOwnProperty(what[i])){
			json[what[i]] = this.infos[what[i]];
		}
	}

	json['patient'] = this.patient.json(what);
	json['medic'] = this.medic.json(what);

	return json;
};



module.exports = RendezVous; 