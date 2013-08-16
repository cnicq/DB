var models = require('../models');
var Combined = models.Combined;

exports.getCombinedsByQuery = function (query, opt, callback) {
  	Combined.find(query, "", opt, callback);
};

exports.getCombinedByID = function (id, callback) {
  	Combined.findOne({_id: id}, callback);
};

exports.getCountByCondition = function (query, opt, callback) {
  	Combined.count(query, "", opt, callback);
};

exports.increaseViews = function(id, callback){
	Combined.update({_id: id}, {$inc:{Views:1}}, { multi: true }, callback);
}