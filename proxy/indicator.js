var models = require('../models');
var Indicator = models.Indicator;

exports.getIndicatorsByQuery = function (query, opt, callback) {
  	Indicator.find(query, "", opt, callback);
};

exports.getIndicatorByID = function (id, callback) {
  	Indicator.findOne({_id: id}, callback);
};

exports.delIndicatorByID = function(id, callback){
	Indicator.remove({_id:id}, callback);
}

exports.setCombinedDataIDByID = function(id, combineddata_id, callback){
	Indicator.update({_id:id}, {$set : {CombinedDataID : combineddata_id}}, callback);
}

exports.setCombinedDataIDbyCombinedID = function(combineddata_id, newid, callback){
	Indicator.update({CombinedDataID:combineddata_id}, {$set : {CombinedDataID : newid}}, callback);
}

exports.getCountByQuery = function (query, callback) {
  	Indicator.count(query, callback);
};