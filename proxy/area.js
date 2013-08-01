var models = require('../models');
var Area = models.Area;

exports.getAreas = function (callback) {
  	Area.find({}, "", "", callback);
};