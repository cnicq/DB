var models = require('../models');
var Area = models.Area;

exports.getAreas = function (callback) {
  	Area.find({}, "", "", callback);
};

exports.getAreaByID = function (id, callback) {
  	Area.findOne({'_id': id}, callback);
};
