/**
table à utiliser pour cette classe
@private
@property table 
@type String
@default "token"
**/
var table = 'token';

/**
@class Token
@constructor
@param {Object}infos 
**/
var Token = function Token(infos){
	var params = {
		token :'',
		expiration : '',
		type: ''
	};

	for(var i in infos){
		if(params.hasOwnProperty(i)){
			params[i] = infos.medic[i];
		}
	}

	/**
	Objet contenant les informations d'un token
	@property infos 
	@type Object
	@default "{
		token :'',
		expiration : '',
		type: ''
	}"
	**/
	this.infos = params;
}

function createToken(id, type) {
	var crypto = require('crypto');

	var minutes = 20;
	var result = {
		idUser : id,
		type: type,
		expiration : new Date(new Date().getTime() + minutes * 60000),
		token : crypto.createHash('sha1').update(crypto.randomBytes(24).toString('hex') + '#' + id).digest("hex")
	}

	return result;
}

//Methodes de classe
Token.create = function create(id, type, callback){
	var token = createToken(id, type);

	var query = db.client.query('DELETE FROM ' + table + ' WHERE idUser=?', token.idUser ,function(err){
		var insert_query = db.client.query('INSERT INTO ' + table + ' SET ?', token ,function(err){
			if(!err){
				callback(token);
			}
		});
		console.log('Executing : ' + insert_query.sql);
	});

	console.log('Executing : ' + query.sql);
}

Token.isValid = function isValid(token, callback){
	var query = db.client.query('SELECT * FROM ' + table + ' WHERE token=? AND expiration > NOW() LIMIT 1', [token], 
		function(err, result){
			if(err || result[0] == null){
				callback(null);
				return;
			}
			
			callback(result[0]);
		}
	);

	console.log('Executing : ' + query.sql);
}

Token.isMedicValid = function isMedicValid(token, callback){
	var query = db.client.query('SELECT * FROM ' + table + ',medic WHERE medic.idUser = token.idUser AND token= ? AND expiration > NOW() limit 1', [token], 
		function(err,result){
			if(err || result[0] == null){
				callback(null);
			}
			else{
				callback(result[0].idUser);
			}
	});

	console.log('Executing : ' + query.sql);
}

Token.isPatientValid = function isPatientValid(token, callback){
	var query = db.client.query('SELECT * FROM ' + table + ',patient WHERE patient.idUser = token.idUser AND token= ? AND expiration > NOW() limit 1', [token], 
		function(err,result){
			if(err || result[0] == null){
				callback(null);
			}
			else{
				callback(result[0].idUser);
			}
	});

	console.log('Executing : ' + query.sql);
}

Token.isAdminValid = function isAdminValid(token, callback){
	var query = db.client.query('SELECT * FROM ' + table + ',admin WHERE admin.idUser = token.idUser AND token= ? AND expiration > NOW() limit 1', [token], 
		function(err,result){
			if(err || result[0] == null){
				callback(null);
			}
			else{
				callback(result[0].idUser);
			}
	});

	console.log('Executing : ' + query.sql);
}

module.exports = Token;