
/*
 * GET home page.
 */
var mongoose = require('mongoose');
var config = require('../config').config

exports.index = function(req, res){
  res.render('index', { title: config.app_title });
};

exports.mongodb = function(req, res){
  res.render('mongodb', { title: config.app_title });
};

exports.mongodb_remove_meta_collections = function(req, res){
	console.log("mongodb_remove_meta_collections");
  	mongoose.connection.db.collectionNames(function (err, names) {
  		for (var i = names.length - 1; i >= 0; i--) {
  			
  			if (names[i].name.indexOf('MetaData_') >= 0) {
  				console.log("Delete start " + names[i].name);
  				mongoose.connection.db.dropCollection(names[i].name, function(err, result) {
  					console.log(err);
          		});
  			};
  		};
	});
};