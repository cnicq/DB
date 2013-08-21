var mongoose = require('mongoose');
var config = require('../config').config
var Combined = require('../proxy/combined');
var Indicator = require('../proxy/indicator');
var Catalog = require('../proxy').Catalog;
var Meta = require('../proxy/meta');
var IndicatorCtrl = require('./indicator')

// Combined data
exports.combineddata = function(req, res){
  var option = '';
  Catalog.getCatalogs(function (err, Datas) {
    for (var i = Datas.length - 1; i >= 0; i--) {
      if(Datas[i].ParentName != ""){
        option += Datas[i].Name + ':' + Datas[i].NameLoc.Chinese + '-'+ Datas[i].Name + ';'; 
      }
    };
    res.render('management/combined', { title: config.app_title, CatalogOptions: option });  
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
    res.send(combineds);
  });
};

exports.combineddata_update = function (req, res, next) {
  var ids = (req.body._id).split(',');
  var oper = req.body.oper;
  for (var i = ids.length - 1; i >= 0; i--) {
    if (ids[i] == undefined || ids[i] == '') {
      continue;
    };
    var id =ids[i];
    switch(oper){
      case 'del':
      Indicator.setCombinedDataID(id, null, function (err, rows){
      });
      Combined.delCombinedByID(id, function (err, rows) {
      });
      break;
      case 'edit':
        Combined.setCatalogName(id, catalogName, function (err, rows) {
        });
      break;
    }
  }

  res.redirect('management/combineddata');
};

// Indicator data
exports.indicatordata = function(req, res){
  res.render('management/indicator', { title: config.app_title});  
};

exports.indicatordata_list = function(req, res){
  var limit = req.query.rows;
  var page = req.query.page - 1;
  var options = { skip: (page) * limit, limit: limit };
  Indicator.getIndicatorsByQuery({}, options, function (err, indicators) {
    if (err) {
      return next(err);
    }
    res.send(indicators);
  });
};

exports.indicatordata_update = function (req, res, next) {
  var ids = (req.body._id).split(',');
  var oper = req.body.oper;
  for (var i = ids.length - 1; i >= 0; i--) {
    if (ids[i] == undefined || ids[i] == '') {
      continue;
    };
    var id = ids[i];
    switch(oper){
        case 'del':
        IndicatorCtrl.DelIndicator(id, function (err, rows) {
        });
        break;
    }
    
  };
  res.redirect('management/indicatordata');
};

exports.indicatordata_refreshcombined = function (req, res, next) {
  var ids = req.params.ids.split(',');
  for (var i = ids.length - 1; i >= 0; i--) {
    if (ids[i] == undefined || ids[i] == '') {
      continue;
    };
    var id = ids[i];
    IndicatorCtrl.RefreshDefaultCombinedData(id, function (err, data) {});
  };

  res.send('');
};

// Meta data
exports.metadata = function(req, res){
  var indicatorid = req.query.indicatorid;
  
  Meta.getMetaDataByID(indicatorid, function (err, Datas) {
     if (err) {
      return next(err);
    }
   
    res.send(Datas);
  });
  res.render('management/meta', { title: config.app_title});  
};

exports.metadata_list = function(req, res){
  
};

exports.remove_meta_collections = function(req, res){
    mongoose.connection.db.collectionNames(function (err, names) {
      for (var i = names.length - 1; i >= 0; i--) {
        var name = names[i].name.split('.')[1];
        if (name.indexOf('MetaData_') >= 0) {
          console.log("Delete collection : " + name);
          mongoose.connection.db.dropCollection(name, function(err, result) {
              });
        };
      };
  });
};