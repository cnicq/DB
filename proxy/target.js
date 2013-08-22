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