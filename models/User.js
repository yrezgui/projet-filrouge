/**
table à utiliser pour cette classe
@private
@property table 
@type String
@default "user"
**/
var table = 'user';

/**
@class User
@constructor
@param {Object}infos 
**/
var User = function User(infos){

	var  params = {
		id : '',
		firstname : '', 
		lastname : '',
		gender : '',
		email : '',
		birthdate : '',
		password : ''
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
		id : '',
		firstname : '', 
		lastname : '',
		gender : '',
	}"
	**/
	this.infos = params;
}

/**
Ajoute un nouvel utilisateur dans la base de données
@method create
@static
@param {Object} infos infos pour la creation de l'utilisateur
@param {function(err,result)} callback callback appelée par la fonction à la fin de l'insertion
@return appel la callback avec soit les erreurs soit un object User correspondant au nouvel utilisateur inseré
@example
	//Creer un nouvel utilisateur et retourner true ou false
	User.create({
		firstname : "Ferretti",
		lastname : "Cédric",
		password : "a94a8fe5ccb19ba61c4c0873d391e987982fbbd3",
		email : "ferretticedric@gmail.com",
		gender : "male",
		birthdate : "1992-08-07"},
	function(err,result){
		if(err != null){
			response.json({success : true});
		}
		else{
			response.json({success : false});
		}
	})
**/
User.create = function create(infos,callback){
	var query = db.client.query('INSERT INTO '+ table +' SET ?', infos, function(err, result) {
		if(err) {
			callback(err, null);	
		}
		else {
			User.find({id: result.insertId}, function(err,result){
				callback(null, result);
			});
			
		}
	});
	console.log('Executing : ' + query.sql);
}

/**
Recherche les utilisateurs correspondant aux données recherchées (infos) 
et appelle la callback donnée (callback)
@method findAll 
@static
@param {Object}infos Les informations à rechercher,
@param {function(err, result)}callback Callback à executer.
@return appel de la callback avec soit les erreurs soit un tableau d'object User correspondant à la recherche
@example
	//Afficher des utilisateurs dont le prénom est toto
	User.findAll({firstname: 'toto'}, function(err, result){
		if(err != null)
			return false;

		return result;
	});
**/
User.findAll = function findAll(callback){
	var query = db.client.query('SELECT * FROM ' + table, function(err, result) {
		var objs = [];
		if(err) {
			callback(err, null);	
		}
		else {
			for(var i in result){
				console.log(result[i]);
				objs.push(new User(result[i]));
			}
			callback(null, objs);
		}
	});
	console.log('Executing : ' + query.sql);
}

/**
Recherche un utilisateur correspondant aux données recherchées (infos) 
et appel la callback donnée (callback)
@method find
@static
@param {Object} infos Les informations à rechercher,
@param {function} callback Callback à executer
@return appel de la callback avec soit les erreurs soit un object User correspondant à la recherche
**/
User.find = function find(infos, callback){

	var where = ' ';
	for(var i in infos){
		where += " " + i + "='" +infos[i] + "' AND";
	}
	where = where.slice(0, -3);
	var query = db.client.query({
		sql :'SELECT * FROM ' + table + ' WHERE '+ where + ' AND active = 1 LIMIT 1'
	}, function(err, result) {

		if(err != null) {
			callback(err, null);
			return;	
		}

		if(result[0] == null){
			callback(null, null);
			return;
		}
				
		var obj = new User(result[0]);
		callback(null, obj);
	});

	console.log('Executing : ' + query.sql);
}

/**
Retourne une ou plusieurs propriétés demandées (what) de l'utilisateur
@method get
@param infos {String|Object} Les propriétés demandées
@return La ou les propriétés demandées
**/
User.prototype.get = function get(what){
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

User.getType = function getType(id, callback){
	var query = db.client.query('SELECT IF(admin.idUser IS NOT NULL, "admin",if(medic.idUser IS NOT NULL, "medic",if(patient.idUser IS NOT NULL, "patient",if(secretary.idUser IS NOT NULL, "secretary", null)))) as type FROM '+ table +' LEFT JOIN medic on medic.idUser = user.id LEFT JOIN  patient on patient.idUser = user.id LEFT JOIN admin on admin.idUser = user.id LEFT JOIN  secretary on secretary.idUser = user.id WHERE user.id = ?', id, callback) ;

	console.log('Executing : ' + query.sql);
}

/**
Affecte une ou plusieurs propriétés données (values) de l'utilisateur et appelle la callback donnée (callback)
@method set
@param infos {Object} Les propriétés données
**/
User.prototype.set = function set(values){
	for(var i in values){
		if(this.infos.hasOwnProperty(i) && values[i] != null){
			this.infos[i] = values[i];
		}
	}
};

/**
Désactive (suppression) un utilisateur et appelle la callback donnée (callback)
@method desactivate
@param callback {function} Callback à executer
**/
User.prototype.desactivate = function desactivate(callback){
	var query = db.client.query('UPDATE ' + table + ' SET active=0  WHERE id='+this.infos.id, callback);
	console.log('Executing : ' + query.sql);
}

/**
Enregistre un utilisateur qu'il soit modifié ou non et appelle la callback donnée (callback)
@method save
@param callback {function} Callback à executer
**/
User.prototype.save = function save(callback){

	var query = db.client.query('UPDATE ' + table + ' SET ?  WHERE id='+this.infos.id, this.infos, function(err){
		if(err == null){
			callback(true);
		}
		else{
			console.log(err);
			callback(false);
		}
	});

	console.log('Executing : ' + query.sql);
}

/**
Retourne une ou plusieurs propriétés demandées (what) de l'utilisateur
@method json
@param infos {String|Object} Les propriétés demandées
@return La ou les propriétés demandées
**/
User.prototype.json = function json(what){
	var json = {};

	for(var i in what){
		if(this.infos.hasOwnProperty(what[i])){
			json[what[i]] = this.infos[what[i]];
		}
	}
	
	return json;
}

module.exports = User; 