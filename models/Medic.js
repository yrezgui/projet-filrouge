/**
table à utiliser pour cette classe
@private
@property table 
@type String
@default "medic"
**/
var table = 'medic';
/**
@class Medic
@constructor
@param {Object}infos 
**/
var Medic = function Medic(infos, callback){
	var params = {
		idUser : '',
		idService : '',
		idSpeciality : '',
	};

	for(var i in infos.medic){
		if(params.hasOwnProperty(i)){
			params[i] = infos.medic[i];
		}
	}

	/**
	Objet contenant les informations publiques d'un rendez-vous
	@property infos 
	@type Object
	@default "{
		idUser : '',
		idService : '',
		idSpeciality : '',
	}"
	**/
	this.infos = params;
	this.user = new db.models.User(infos.user);
	this.service = new db.models.Service(infos.service);
	this.speciality = new db.models.Speciality(infos.speciality);
}

/**
Permet d'inserer un nouveau médecin dans la base de données
@method create
@static
@param {Object} infos infos pour la creation du médecin
@param {function(err,result)} callback callback appelée par la fonction à la fin de l'insertion
@return appelle la callback avec soit les erreurs soit un object Medic correspondant au nouveau médecin inseré
@example
	// Creer un nouveau médecin et retourner true ou false
	User.create({
		firstname : "Ferretti",
		lastname : "Cédric",
		password : "a94a8fe5ccb19ba61c4c0873d391e987982fbbd3",
		email : "ferretticedric@gmail.com",
		gender : "male",
		birthdate : "1992-08-07",
		idUser : "007",
		idService : "003",
		idSpeciality : "0031"},
	function(err,result){
		if(err != null){
			response.json({success : true});
		}
		else{
			response.json({success : false});
		}
	})
**/
Medic.create = function create(infos,callback){
	var q = db.client.createQueue();
	
	q.query("CALL createMedic(@id, ?, ?, ?, ?, ?, ?, ?, ?)", [infos.user.password, infos.user.firstname, infos.user.lastname, infos.user.birthdate, infos.user.email, infos.user.gender, infos.service, infos.speciality]);

	q.query('SELECT @id as id', function(err, result){
		if(err != null || result[0].id == null){
			callback(err, null);
			return;
		}

		callback(null, result);
	});

	q.execute();
};

/**
Rechercher les médecins correspondant aux données recherchées (infos) 
et appelle la callback donnée (callback)
@method findAll 
@static
@param {Object}infos Les informations à rechercher,
@param {function(err, result)}callback Callback à executer.
@return appel de la callback avec soit les erreurs soit un tableau d'object Medic correspondant à la recherche
@example
	//Afficher les médecins dont le prénom est toto
	Medic.findAll({firstname: 'toto'}, function(err, result){
		if(err != null)
			return false;

		return result;
	});
**/
Medic.findAll = function findAll(callback){
	var sql = 'SELECT * FROM ' + table + ', user, service, speciality WHERE user.id = idUser AND idService = service.id AND speciality.id = idSpeciality AND user.active = 1';

	var query = db.client.query({sql : sql, nestTables: true}, function(err, result) {
		var objs = [];
		if(err) {
			callback(err, null);	
		}
		else {
			for(var i in result){
				objs.push(new Medic(result[i]));
			}
			callback(null, objs);
		}
	});
	console.log('Executing : ' + query.sql);
}

/**
Recherche un médecin correspondant aux données recherchées (infos) 
et appelle la callback donnée (callback)
@method find
@static
@param {Object} infos Les informations à rechercher,
@param {function} callback Callback à executer
@return appel de la callback avec soit les erreurs soit un object Medic correspondant à la recherche
**/
Medic.find = function find(infos, callback){

	var where = ' idUser = user.id AND idService = service.id AND speciality.id = idSpeciality AND active = 1';
	for(var i in infos){
		where += " AND " + i + "='" +infos[i] + "'";
	}

	var query = db.client.query({
		sql :'SELECT * FROM ' + table + ', user, service, speciality WHERE '+ where + ' LIMIT 1',
		nestTables : true
	}, function(err, result) {

		if(err != null) {
			callback(err, null);
			return;	
		}

		if(result[0] == null){
			callback(null, null);
			return;
		}
				
		var obj = new Medic(result[0]);
		callback(null, obj);
	});

	console.log('Executing : ' + query.sql);
}

//Methodes d'instance
Medic.prototype.get = function get(what){
	if(typeof(what) == "string")
		return this.infos[what];

	var retour = {};

	for(var i in what){
		if(this.infos.hasOwnProperty(what[i])){
			retour[what[i]] = this.infos[what[i]];
		}
	}

	return retour;
};

Medic.prototype.set = function set(values){
	for(var i in values){
		if(this.infos.hasOwnProperty(i) && values[i] != null ){
			this.infos[i] = values[i];
		}
	}

	this.user.set(values.user);

};

Medic.prototype.desactivate = function desactivate(callback){
	this.user.desactivate(callback);
};

Medic.prototype.save = function save(callback){
	var user = this.user;

	var query = db.client.query('UPDATE ' + table + ' SET ?  WHERE idUser='+this.infos.idUser, {idService:this.infos.idService, idSpeciality:this.infos.idSpeciality }, function(err){
		if(err != null){
			callback(false);
			return;
		}

		user.save(callback);

	});
	console.log('Executing : ' + query.sql);
};

Medic.prototype.json = function json(what){
	var json = {};

	for(var i in what){
		if(this.infos.hasOwnProperty(what[i])){
			json[what[i]] = this.infos[what[i]];
		}
	}

	json['user'] = this.user.json(what);
	json['service'] = this.service.json(what);
	json['speciality'] = this.speciality.json(what);

	return json;
};

module.exports = Medic; 


