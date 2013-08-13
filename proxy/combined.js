var models = require('../models');
var Combined = models.Combined;

exports.getCombinedsByQuery = function (query, opt, callback) {
  	Combined.find(query, "", opt, callback);
};

exports.getCombinedByID = function (id, callback) {
  	Combined.findOne({_id: id}, callback);
};