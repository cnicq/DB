var mongoose = require('mongoose');
var config = require('../config').config
var Combined = require('../proxy/combined');
var Catalog = require('../proxy').Catalog;

exports.index = function(req, res){
  res.render('management/index', { title: config.app_title });
};

exports.combineddata = function(req, res){
  var option = '';
  Catalog.getCatalogs(function (err, Datas) {
    for (var i = Datas.length - 1; i >= 0; i--) {
      if(Datas[i].ParentName != ""){
        option += Datas[i].Name + ':' + Datas[i].NameLoc[0].Chinese + '-'+ Datas[i].Name + ';'; 
      }
    };
    console.log("combineddata");
    res.render('management/combined', { title: config.app_title, CatalogOptions: option });  
  });
};

exports.remove_meta_collections = function(req, res){
  	mongoose.connection.db.collectionNames(function (err, names) {
  		for (var i = names.length - 1; i >= 0; i--) {
  			var name = names[i].name.split('.')[1];
  			if (name.indexOf('MetaData_') >= 0) {
  				console.log("Delete start " + name);
  				mongoose.connection.db.dropCollection(name, function(err, result) {
          		});
  			};
  		};
	});
};

exports.combineddata_list = function(req, res){
  var limit = req.query.rows;
  var page = req.query.page - 1;

  var options = { skip: (page) * limit, limit: limit };
  Combined.getCombinedsByQuery({}, options, function (err, combineds) {
    if (err) {
      return next(err);
    }
    console.log("combineddata_list");
    res.send(combineds);
  });
};

exports.combineddata_update = function (req, res, next) {
  var _id = (req.body._id);
  var catalogName = (req.body.Catalog);

  Combined.setCatalogName(_id, catalogName, function (err, rows) {

    res.redirect('management/combineddata');
  });
  
};

exports.indicatordata = function(req, res){
  var option = '';
  Catalog.getCatalogs(function (err, Datas) {
    for (var i = Datas.length - 1; i >= 0; i--) {
      if(Datas[i].ParentName != ""){
        option += Datas[i].Name + ':' + Datas[i].NameLoc[0].Chinese + '-'+ Datas[i].Name + ';'; 
      }
    };
    res.render('management/indicator', { title: config.app_title, CatalogOptions: option });  
  });
};


