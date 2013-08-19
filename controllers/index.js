
/*
 * GET home page.
 */
var mongoose = require('mongoose');
var config = require('../config').config

exports.index = function(req, res){
  res.render('index', { title: config.app_title });
};

