//Attributs
var table = 'service';

//Constructeur
var Service = function Service(infos){
	var params = {
		id : '',
		name : '',
	};

	for(var i in infos){
		if(params.hasOwnProperty(i)){
			params[i] = infos[i];
		}
	}

	//Attribut de l'objet
	this.infos = params;
	

}

//Methodes de classe
Service.create = function create(infos, callback){

	var q = db.client.createQueue();

	q.query('CALL createService(@id, ?)', [infos.name]);
	q.query('SELECT @id AS id', function(err, result){
		result = result[0];

		if(err != null || result.id == null){
			callback(err, null);
			return;
		}

		callback(null, result);
	});
	
	q.execute();
}

Service.findAll = function findAll(callback){
	var query = db.client.query('SELECT * FROM ' + table, function(err, result) {

		if(err) {
			callback(err, null);
			return;	
		}

		var objs = [];
		for(var i in result){
			objs.push(new Service(result[i]));
		}
		callback(null, objs);

	});
	console.log('Executing : ' + query.sql);
}

Service.find = function find(infos, callback){

	var where = '';
	for(var i in infos){
		where += " " + i + "='" +infos[i] + "' AND";
	}
	where = where.slice(0, -3);

	var query = db.client.query('SELECT * FROM ' + table + ' WHERE '+ where + ' LIMIT 1', infos, function(err, result) {
		if(err) {
			callback(err, null);
			return;
		}

		if(result[0] == null){
			callback(null, null);
			return;
		}

		var obj = new Service(result[0]);
		callback(null, obj);

	});
	console.log('Executing : ' + query.sql);
}

//Methodes d'instance
Service.prototype.get = function get(what){
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

Service.prototype.set = function set(values){
	for(var i in values){
		if(this.infos.hasOwnProperty(i)){
			this.infos[i] = values[i];
		}
	}
};

Service.prototype.del = function del(callback){
	var query = db.client.query('DELETE FROM ' + table + ' WHERE id='+this.infos.id, callback);
};

Service.prototype.save = function save(callback){

	var q = db.client.createQueue();

	q.query('SET @id = ?', [infos.id]);
	q.query('CALL updateService(@id, ?)', [infos.name]);
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

Service.prototype.json = function json(what){
	var json = {};

	for(var i in what){
		if(this.infos.hasOwnProperty(what[i])){
			json[what[i]] = this.infos[what[i]];
		}
	}
	
	return json;
}


module.exports = Service; 


