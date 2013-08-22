var models = require('../models');
var Area = models.Area;

exports.getAreas = function (callback) {
  	Area.find({}, "", "", callback);
};

exports.getAreasByQuery = function (query, opt, callback) {
  	Area.find(query, "", opt, callback);
};

exports.getAreaByID = function (id, callback) {
  	Area.findOne({'_id': id}, callback);
};

exports.getCountByQuery = function (query, callback) {
  Area.count(query, callback);
};

exports.setAreaType = function(id, type, callback){
	Area.update({_id:id}, {$set : {AreaType : type}}, callback);
}