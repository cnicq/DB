var mongoose = require('mongoose');
var config = require('../config').config;

mongoose.connect(config.db, function (err) {
  if (err) {
    console.error('connect to %s error: ', config.db, err.message);
    process.exit(1);
  }
});

// models
require('./indicator');
require('./area');
require('./target');
require('./combined');
require('./catalog');

exports.Indicator = mongoose.model('IndicatorData');
exports.Meta = require('./meta').MetaModel;
exports.Area = mongoose.model('AreaData');
exports.Target = mongoose.model('TargetData');
exports.Combined = mongoose.model('CombinedData');
exports.Catalog = mongoose.model('CatalogData');