var models = require('../models');
var Target = models.Target;

exports.getTargets = function (callback) {
  	Target.find({}, "", "", callback);
};