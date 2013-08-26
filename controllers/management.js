var mongoose = require('mongoose');
var config = require('../config').config
var Combined = require('../proxy/combined');
var Indicator = require('../proxy/indicator');
var Catalog = require('../proxy').Catalog;
var Meta = require('../proxy/meta');
var IndicatorCtrl = require('./indicator');
var Area = require('../proxy/area');
var Target = require('../proxy/target');
var TargetCtrl = require('./target');
var AreaCtrl = require('./area');
var CatalogCtrl = require('./catalog');

// Combined data
exports.combineddata = function(req, res){

  var option = '';
  for(key in CatalogCtrl.Catalogs){
    for (var i = CatalogCtrl.Catalogs[key].length - 1; i >= 0; i--) {
      CatalogCtrl.Catalogs[key][i]
      option += CatalogCtrl.Catalogs[key][i].Name + ':' + CatalogCtrl.Catalogs[key][i].NameLoc.Chinese + '-'+ CatalogCtrl.Catalogs[key][i].Name + ';'; 
    };
  }
  
  res.render('management/combined', { title: config.app_title, CatalogOptions: option });  
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
      Indicator.setCombinedDataIDbyCombinedID(id, null, function (err, rows){
      });
      Combined.delCombinedByID(id, function (err, rows) {
      });
      break;
      case 'edit':
       Combined.updateByQuery({_id:id}, {$unset: {CatalogNames:1}}, function(err, rows){
         Combined.updateByQuery({_id:id}, {$addToSet: {CatalogNames:req.body.Catalog},
         $set : {'NameLoc.Chinese':req.body.Name}}, 
          function (err, rows) {
            console.log(err);
          });
       });
       
      break;
    }
  }

  res.redirect('management/combineddata');
};

// Indicator data
exports.indicatordata = function(req, res){
  
  var Areas = '', Targets;
  for(key in AreaCtrl.Areas){
    Areas += AreaCtrl.Areas[key]._id + ':' + AreaCtrl.Areas[key].NameLoc.Chinese + ';';
  }

  for(key in TargetCtrl.Targets){
    Targets += TargetCtrl.Targets[key]._id + ':' + TargetCtrl.Targets[key].NameLoc.Chinese + ';';
  }
  res.render('management/indicator', { title: config.app_title, AreaOptions: Areas , TargetOptions : Targets});  
};

exports.indicatordata_list = function(req, res){
  var limit = req.query.rows;
  var page = req.query.page - 1;
  var options = { skip: (page) * limit, limit: limit };
  Indicator.getIndicatorsByQuery({}, options, function (err, indicators) {
    if (err) {
      return next(err);
    }

    for (var i = indicators.length - 1; i >= 0; i--) {
      indicators[i]['SrcTargetName'] = TargetCtrl.GetTargetNameLoc(indicators[i].SrcTargetID, 'Chinese');
    };
    
    if (limit <= 0) {limit = 10;};
    var list = {};
    Indicator.getCountByQuery({}, function(e, num){
      list['page'] = req.query.page;
      list['total'] = parseInt(num / limit) + 1;
      list['records'] = num;
      list['rows'] = indicators;

      res.send(list);
    });
    
  });
};

exports.indicatordata_update = function (req, res, next) {
  var oper = req.body.oper;
  if (oper == 'add') {
    Indicator.newAndSave(req.body.Name, req.body.SrcTargetID, function (err, rows) {});
  }else if (oper == 'edit') {
    Indicator.updateByQuery({_id:req.body._id}, 
      {$set : {'NameLoc.Chinese' : req.body.Name, SrcTargetID : req.body.SrcTargetID}}, function (err, rows) {
      });
  }else if(oper == 'del'){
    var ids = (req.body._id).split(',');
  
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
  res.render('management/meta', { title: config.app_title});  
};

exports.metadata_list = function(req, res){
  var indicatorid = req.query.indicatorid;
  var limit = req.query.rows;
  var page = req.query.page - 1;
  var options = { skip: (page) * limit, limit: limit };
  Meta.getMetaDataByID(indicatorid, {}, options, function (err, Metas) {
     if (err) {
      return next(err);
    }
   
    for (var i = Metas.length - 1; i >= 0; i--) {
      Metas[i]['AreaNameLoc'] = AreaCtrl.GetAreaNameLoc(Metas[i]['AreaID'], 'Chinese');
      Metas[i]['Target1NameLoc'] = TargetCtrl.GetTargetNameLoc(Metas[i]['Target1ID'], 'Chinese');
      Metas[i]['Target2NameLoc'] = TargetCtrl.GetTargetNameLoc(Metas[i]['Target2ID'], 'Chinese');
    };
    
    if (limit <= 0) {limit = 10;};
    var list = {};
    Meta.getCountByQuery(indicatorid, {}, function(e, num){
      list['page'] = req.query.page;
      list['total'] = parseInt(num / limit) + 1;
      list['records'] = num;
      list['rows'] = Metas;
      res.send(list);
    });
  });
};

exports.metadata_update = function (req, res, next) {
  var oper = req.body.oper;
  var ids = req.body._id;
  if (oper == 'del') {
    ids = ids.split(',');
    var ids = (req.body._id).split(',');
    for (var i = ids.length - 1; i >= 0; i--) {
      if (ids[i] == undefined || ids[i] == '') {
        continue;
      };
      
      Meta.delMetaDataByID(req.body.indicatorid, ids[i], function (err, rows) {});
    }
  };
  switch(oper){
      case 'add':
      Meta.newAndSave(req.body.indicatorid, req.body.AreaID, req.body.Target1, req.body.Target2, req.body.Period,
        function (err, rows) {
      });
      break;
  }
  res.redirect('management/indicatordata');
};

exports.metadata_values_update = function (req, res, next) {
  console.log(req.body);
  var oper = req.body.oper;
  var ids = req.body._id;
  if (oper == 'del') {
    var Dates = (req.body.Dates).split(',');
    for (var i = Dates.length - 1; i >= 0; i--) {
      if (Dates[i] == undefined || Dates[i] == '') {
        continue;
      };
      Meta.removeValue(req.body.indicatorid, req.body._id, Dates[i], function (err, rows) {});
    }
  };
  switch(oper){
      case 'add':
      if(req.body.Date != ''){
        Meta.addValue(req.body.indicatorid, req.body._id, req.body.Date, req.body.Value,
          function (err, rows) {
        });
      }
      break;
      case 'edit':
      Meta.updateValue(req.body.indicatorid, req.body._id, req.body.Date, req.body.Value,
        function (err, rows) {
          console.log(err);
      });
      break;
  }
  res.redirect('management/indicatordata');
};

/*
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

    res.render('management/meta', { title: config.app_title}); 
};
*/
// area data
exports.areadata = function(req, res){
  res.render('management/area', { title: config.app_title});  
};

exports.areadata_list = function(req, res){
  var limit = req.query.rows;
  var page = req.query.page - 1;
  var options = { skip: (page) * limit, limit: limit };
  Area.getAreasByQuery({}, options, function (err, areas) {
    if (err) {
      return next(err);
    }

    if (limit <= 0) {limit = 10;};
    var list = {};
    Area.getCountByQuery({}, function(e, num){
      list['page'] = req.query.page;
      list['total'] = parseInt(num / limit) + 1;
      list['records'] = num;
      list['rows'] = areas;
      res.send(list);
    });

  });
};

exports.areadata_update = function (req, res, next) {
  var ids = req.body._id.split(',');
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
        case 'edit':
        Area.setAreaType(id, req.body.AreaType, function (err, rows) {
        });
        break;
    }
    
  };
  res.redirect('management/indicatordata');
};

// target data
exports.targetdata = function(req, res){
  res.render('management/target', { title: config.app_title});  
};

exports.targetdata_list = function(req, res){
  var limit = req.query.rows;
  
  var page = req.query.page - 1;
  var options = { skip: (page) * limit, limit: limit,sort: [ ['_id', 'desc' ]] };
  
  Target.getTargetsByQuery({Type:{$nin:['indicator','Indicator']}}, options, function (err, targets) {
    if (err) {
      return next(err);
    }

    if (limit <= 0) {limit = 10;};
    var list = {};
    var num = Object.keys(TargetCtrl.Targets).length;
    list['page'] = req.query.page;
    list['total'] = parseInt(num / limit) + 1;
    list['records'] = num;
    list['rows'] = targets;

    res.send(list);
  });
};

exports.targetdata_update = function (req, res, next) {
  var oper = req.body.oper;
  var ids = req.body._id;

  if (oper == 'del') {
    ids = ids.split(',');
  };
  switch(oper){
      case 'add':
      Target.newAndSave(req.body.Type, req.body.ChineseName, 
        '', function (err, rows) {
      });
      break;
      case 'edit':
        
        Target.updateByQuery({_id:req.body._id}, 
          {$set:{"NameLoc.Chinese":req.body.ChineseName, Type:req.body.Type}}, function (err, rows) {
        });
      break;
      case 'del':
      for (var i = ids.length - 1; i >= 0; i--) {
        if (ids[i] == undefined || ids[i] == '') {
          continue;
        };
        Target.delTargetByID(ids[i], function (err, rows) {
        });
      }
      break;
  }
  res.redirect('management/targetdata');
};

// catalog data
exports.catalogdata = function(req, res){
  res.render('management/catalog', { title: config.app_title});  
};

exports.catalogdata_list = function(req, res){
  var limit = req.query.rows;
  var page = req.query.page - 1;
  var options = { skip: (page) * limit, limit: limit };

  Catalog.getCatalogsByQuery({}, options, function (err, catalogs) {
    if (err) {
      return next(err);
    }

    if (limit <= 0) {limit = 10;};
    var list = {};
    Catalog.getCountByQuery({}, function(e, num){
      list['page'] = req.query.page;
      list['total'] = parseInt(num / limit) + 1;
      list['records'] = num;
      list['rows'] = catalogs;
      res.send(list);
    });

  });
};

exports.catalogdata_update = function (req, res, next) {
  var oper = req.body.oper;
  var ids = req.body._id;
  if (oper == 'del') {
    ids = ids.split(',');
  };
  switch(oper){
      case 'add':
      Catalog.newAndSave(req.body.Name, req.body.ChineseName, 
        req.body.ParentName, function (err, rows) {
      });
      break;
      case 'edit':
        Catalog.setCatalogName(req.body._id, req.body.Name, function (err, rows) {
        });
      break;
      case 'del':
      for (var i = ids.length - 1; i >= 0; i--) {
        if (ids[i] == undefined || ids[i] == '') {
          continue;
        };
        Catalog.delCatalogByID(ids[i], function (err, rows) {
        });
      }
      break;
  }
  res.redirect('management/catalogdata');
};