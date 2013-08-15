var models = require('../models');
var Target = models.Target;

exports.getTargets = function (callback) {
  	Target.find({}, "", "", callback);
};

exports.getTargetByID = function (id, callback) {
  	Target.findOne({'_id': id}, callback);
};