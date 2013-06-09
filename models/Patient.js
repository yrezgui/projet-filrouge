/**
table à utiliser pour cette classe
@private
@property table 
@type String
@default "patient"
**/
var table = 'patient';

/**
@class Patient
@constructor
@param {Object}infos 
**/
var Patient = function Patient(infos) {
	var params = {
		idUser : '',
	};

	for(var i in infos){
		if(params.hasOwnProperty(i)) {
			params[i] = infos[i];
		}
	}

	/**
	Objet contenant les informations publiques d'un rendez-vous
	@property infos 
	@type Object
	@default "{
		idUser : '',
	}"
	**/
	this.infos = params;
	this.user = new db.models.User(infos);

};

/**
Permet d'inserer un nouveau patient dans la base de données
@method create
@static
@param {Object} infos infos pour la creation du patient
@param {function(err,result)} callback callback appelée par la fonction à la fin de l'insertion
@return appelle la callback avec soit les erreurs soit un object Patient correspondant au nouveau patient insereée
@example
	// Creer un nouveau patient et retourner true ou false
	Patient.create({
		firstname : "Ferretti",
		lastname : "Cédric",
		password : "a94a8fe5ccb19ba61c4c0873d391e987982fbbd3",
		email : "ferretticedric@gmail.com",
		gender : "male",
		birthdate : "1992-08-07",
		idUser : "007"},
	function(err,result){
		if(err != null){
			response.json({success : true});
		}
		else{
			response.json({success : false});
		}
	})
**/
Patient.create = function create(infos, callback){
	var q = db.client.createQueue();

	q.query('CALL createPatient(@id, ?, ?, ?, ?, ?, ?)', [infos.password, infos.firstname, infos.lastname, infos.birthdate, infos.email, infos.gender]);
	q.query('SELECT @id AS id', function(err, result){
		result = result[0];

		if(err != null || result.id == null){
			callback(err, null);
			return;
		}

		callback(null, result);
	});
	
	q.execute();
};

/**
Rechercher les patients correspondant aux données recherchées (infos) 
et appelle la callback donnée (callback)
@method findAll 
@static
@param {Object}infos Les informations à rechercher,
@param {function(err, result)}callback Callback à executer.
@return appel de la callback avec soit les erreurs soit un tableau d'object Patient correspondant à la recherche
@example
	//Afficher les patients dont le prénom est toto
	Patient.findAll({firstname: 'toto'}, function(err, result){
		if(err != null)
			return false;

		return result;
	});
**/
Patient.findAll = function findAll(callback){
	var sql = 'SELECT * FROM ' + table + ', user WHERE user.id = patient.idUser';

	var query = db.client.query(sql, function(err, result) {
		var objs = [];

		if(err) {
			callback(err, null);
			return;
		}

		for(var i in result) {
			objs.push(new Patient(result[i]));
		}

		callback(null, objs);
	});
	console.log('Executing : ' + query.sql);
};

/**
Recherche un utilisateur correspondant aux données recherchées (infos) 
et appel la callback donnée (callback)
@method find
@static
@param {Object} infos Les informations à rechercher,
@param {function} callback Callback à executer
@return appel de la callback avec soit les erreurs soit un object Patient correspondant à la recherche
**/
Patient.find = function find(infos, callback) {

	var where = '  idUser = id AND active = 1';
	for(var i in infos){
		where += " AND " + i + "='" +infos[i] + "'";
	}

	var query = db.client.query('SELECT * FROM ' + table + ', user WHERE '+where+' LIMIT 1',  function(err, result) {
		if(err != null) {
			callback(err, null);
			return;
		}

		if(result[0] == null) {
			callback(null, null);
			return;
		}

		var obj = new Patient(result[0]);
		console.log(callback);
		callback(null, obj);

	});
	console.log('Executing : ' + query.sql);
};

//Methodes d'instance
Patient.prototype.get = function get(what) {
	if(typeof(what) == "string")
		return this.infos[what];

	var retour = {};

	for(var i in what) {
		if(this.infos.hasOwnProperty(what[i])) {
			retour[what[i]] = this.infos[what[i]];
		}
	}

	return retour;
};

Patient.prototype.set = function set(values){
	for(var i in values){
		if(this.infos.hasOwnProperty(i) && values[i] != null){
			this.infos[i] = values[i];
		}
	} 
	this.user.set(values.user);
};

Patient.prototype.desactivate = function desactivate(callback) {
	this.user.desactivate(callback);
};

Patient.prototype.save = function save(callback){
	var user = this.user;

	var q = db.client.createQueue();

	q.query('SET @id = ?', [user.id]);
	q.query('CALL updatePatient(@id, ?, ?, ?, ?, ?, ?)', [user.password, user.firstname, user.lastname, user.birthdate, user.email, user.gender]);
	q.query('SELECT @id AS id', function(err, result){
		result = result[0];

		if(err != null || result.id == null){
			callback(err, null);
			return;
		}

		callback(null, result);
	});
	
	q.execute();
};

Patient.prototype.json = function json(what) {
	var json = {};

	for(var i in what) {
		if(this.infos.hasOwnProperty(what[i])) {
			json[what[i]] = this.infos[what[i]];
		}
	}

	json['user'] = this.user.json(what);

	return json;
};

module.exports = Patient;