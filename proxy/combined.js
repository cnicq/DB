var models = require('../models');
var Combined = models.Combined;
var Utility = require('../lib/Utility');

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

exports.setCatalogName = function (id, name, callback) {
	if (name == undefined || name == '' || name == "undefined") {
		Combined.update({_id: id}, {$unset: {CatalogNames:1}}, { multi: false }, callback);
	}
	else{
		Combined.update({_id: id}, {$addToSet: {CatalogNames:name}}, { multi: false }, callback);
	}
};
exports.updateByQuery = function(query, opt, callback){
  Combined.update(query, opt, callback);
};

exports.delCombinedByID = function(id, callback){
	Combined.remove({_id:id}, callback);
}

exports.getCountByQuery = function (query, callback) {
  Combined.count(query, callback);
};

exports.newAndSave = function (NameChinese, NoteChinese, CombinedType, Condition, callback) {
  var com = new Combined();
  com.NameLoc.Chinese = NameChinese;
  com.NoteLoc.Chinese = NoteChinese;
  com.CombinedType = CombinedType;
  com.Conditions.push(Condition);
  com.UpdateTime = Utility.format_date(new Date());
  com.save(function (err, com) {
    callback(err, com);
  });
};