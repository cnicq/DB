var models = require('../models');
var Meta = models.Meta;
var mongoose = require('mongoose');

exports.getMetaDataByID = function (id, callback) {
  	Meta(id).find({}, "", "", callback);
};

exports.getMetaDataByID = function (id, callback) {
  	Meta(id).find({}, "", "", callback);
};

exports.dropMetaCollection = function(id, callback){
	mongoose.connection.db.dropCollection("MetaData_" + id, callback);
}

exports.getCountByQuery = function (id, query, callback) {
  	Meta(id).count(query, callback);
};