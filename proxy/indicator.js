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

exports.setCombinedDataID = function(combineddata_id, value, callback){
	console.log(value);
	Indicator.update({CombinedDataID:combineddata_id}, {$set : {CombinedDataID : value}}, callback);
}