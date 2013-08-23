var models = require('../models');
var Catalog = models.Catalog;

exports.getCatalogs = function (callback) {
  	Catalog.find({}, "", "", callback);
};

exports.getCatalogByID = function (id, callback) {
  	Catalog.findOne({'_id': id}, callback);
};

exports.getCountByQuery = function (query, callback) {
  	Catalog.count(query, callback);
};

exports.getCatalogsByQuery = function (query, opt, callback) {
  	Catalog.find(query, "", opt, callback);
};

exports.newAndSave = function (Name, NameChinese, ParentName, callback) {
  var com = new Catalog();
  com.NameLoc.Chinese = NameChinese;
  com.Name = Name;
  com.ParentName = ParentName;
  com.save(function (err, com) {
    callback(err, com);
  });
};

exports.setCatalogName = function(id, name, callback){
  Catalog.update({_id:id}, {$set : {Name : name}}, { multi: false }, callback);
}

exports.delCatalogByID = function(id, callback){
  Catalog.remove({_id:id}, callback);
}

