/**
table à utiliser pour cette classe
@private
@property table 
@type String
@default "secretary"
**/
var table = 'secretary';

/**
@class Secretary
@constructor
@param {Object}infos 
**/
var Secretary = function Secretary(infos){
	var params = {
		idUser : '',
	};

	for(var i in infos){
		if(params.hasOwnProperty(i)){
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
Permet d'inserer une nouvelle secrétaire dans la base de données
@method create
@static
@param {Object} infos infos pour la creation de la secrétaire
@param {function(err,result)} callback callback appelée par la fonction à la fin de l'insertion
@return appelle la callback avec soit les erreurs soit un object Secretary correspondant à la nouvelle secrétaire inserée
@example
	// Creer une nouvelle secrétaire et retourner true ou false
	User.create({
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
Secretary.create = function create(infos, callback){
	var q = db.client.createQueue();

	q.query('CALL createSecretary(@id, ?, ?, ?, ?, ?, ?)', [infos.password, infos.firstname, infos.lastname, infos.birthdate, infos.email, infos.gender]);
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
Rechercher les secrétaires correspondant aux données recherchées (infos) 
et appelle la callback donnée (callback)
@method findAll 
@static
@param {Object}infos Les informations à rechercher,
@param {function(err, result)}callback Callback à executer.
@return appel de la callback avec soit les erreurs soit un tableau d'object Secretary correspondant à la recherche
@example
	//Afficher des secrétaires dont le prénom est toto
	Secretary.findAll({firstname: 'toto'}, function(err, result){
		if(err != null)
			return false;

		return result;
	});
**/
Secretary.findAll = function findAll(callback){
	var sql = 'SELECT * FROM ' + table + ', user WHERE user.id = secretary.idUser AND active = 1';

	var query = db.client.query(sql, function(err, result) {
		var objs = [];
		if(err) {
			callback(err, null);	
		}
		else {
			for(var i in result){
				objs.push(new Secretary(result[i]));
			}
			callback(null, objs);
		}
	});
	console.log('Executing : ' + query.sql);
};

/**
Recherche une secrétaire correspondant aux données recherchées (infos) 
et appelle la callback donnée (callback)
@method find
@static
@param {Object} infos Les informations à rechercher,
@param {function} callback Callback à executer
@return appel de la callback avec soit les erreurs soit un object Secretary correspondant à la recherche
**/
Secretary.find = function find(infos, callback){

	var where = ' idUser = id';
	for(var i in infos){
		where += " AND " + i + "='" +infos[i] + "'";
	}

	var query = db.client.query('SELECT * FROM ' + table + ', user WHERE '+ where + ' AND active = 1 LIMIT 1', infos, function(err, result) {
		if(err != null) {
			callback(err, null);	
		}
		else {
			if(result[0] == null)
				callback(null, null);
			else{
				var obj = new Secretary(result[0]);
				callback(null, obj);
			}
		}
	});
	console.log('Executing : ' + query.sql);
};

//Methodes d'instance
Secretary.prototype.get = function get(what){
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

Secretary.prototype.set = function set(values){
	for(var i in values){
		if(this.infos.hasOwnProperty(i) && values[i] != null){
			this.infos[i] = values[i];
		}
	} 
	this.user.set(values.user);
};

Secretary.prototype.desactivate = function desactivate(callback){
	this.user.desactivate(callback);
}

Secretary.prototype.save = function save(callback){
	var user = this.user;

	var q = db.client.createQueue();

	q.query('SET @id = ?', [user.id]);
	q.query('CALL updateSecretary(@id, ?, ?, ?, ?, ?, ?)', [user.password, user.firstname, user.lastname, user.birthdate, user.email, user.gender]);
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

Secretary.prototype.json = function json(what){
	var json = {};

	for(var i in what){
		if(this.infos.hasOwnProperty(what[i])){
			json[what[i]] = this.infos[what[i]];
		}
	}

	json['user'] = this.user.json(what);

	return json;
};


module.exports = Secretary; 


