var models = require('../models');
var Meta = models.Meta;
exports.getMetaDataByID = function (id, callback) {
  	Meta(id).find({}, "", "", callback);
};