var models = require('../models');
var Catalog = models.Catalog;

exports.getCatalogs = function (callback) {
  	Catalog.find({}, "", "", callback);
};

exports.getCatalogByID = function (id, callback) {
  	Catalog.findOne({'_id': id}, callback);
};
