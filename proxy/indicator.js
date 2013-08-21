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

exports.resetCombinedDataID = function(combineddata_id, callback){
	Indicator.update({CombinedDataID:combineddata_id}, {$set : {CombinedDataID : null}}, callback);
}