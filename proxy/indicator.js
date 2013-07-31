var models = require('../models');
var Indicator = models.Indicator;

exports.getIndicatorsByQuery = function (query, opt, callback) {
  	Indicator.find({}, callback);
};