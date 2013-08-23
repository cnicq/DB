var models = require('../models');
var Target = models.Target;

exports.getTargets = function (callback) {
  	Target.find({}, "", "", callback);
};

exports.getTargetsByQuery = function (query, opt, callback) {
  	Target.find(query, "", opt, callback);
};

exports.getTargetByID = function (id, callback) {
  	Target.findOne({'_id': id}, callback);
};

exports.getCountByQuery = function (query, callback) {
  	Target.count(query, callback);
};

exports.updateByQuery = function(query, opt, callback){
	Target.update(query, opt, callback);
};

exports.newAndSave = function (Type, NameChinese, NoteChinese, callback) {
  var com = new Target();
  com.NameLoc.Chinese = NameChinese;
  com.Type = Type;
  com.NoteLoc.Chinese = NoteChinese;
  com.save(function (err, com) {
    callback(err, com);
  });
};
