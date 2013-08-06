var models = require('../models');
var Indicator = models.Indicator;

exports.getIndicatorsByQuery = function (query, opt, callback) {
  	Indicator.find(query, "", opt, callback);
};

exports.getIndicatorByID = function (id, callback) {
  	Indicator.findOne({_id: id}, callback);
};