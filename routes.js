var index = require('./controllers/index');
var indicator = require('./controllers/indicator');
var combined = require('./controllers/combined');
var catalog = require('./controllers/catalog');
var management = require('./controllers/management');

module.exports = function(app){

  app.get('/', index.index);
  app.get('/combined/newest/:page', combined.newest);
  app.get('/combined/hotest/:page', combined.hotest);
  app.get('/combined/search/:keyword', combined.search);
  app.get('/combined/catalog/:catalog/:page', combined.catalog);
  app.get('/combined/byid/:id', combined.byid);
  app.get('/catalog', catalog.datas);
  

  // management
  // combined data
  app.get('/management', management.combineddata);
  app.get('/management/combineddata', management.combineddata);
  app.get('/management/combineddata/list/', management.combineddata_list);
  app.post('/management/combineddata/update', management.combineddata_update);

  // indicator data
  app.get('/management/indicatordata', management.indicatordata);
  app.get('/management/indicatordata/list/', management.indicatordata_list);
  app.post('/management/indicatordata/update', management.indicatordata_update);
  app.get('/management/indicatordata/refreshcombineddata/:ids', management.indicatordata_refreshcombined);
  app.get('/management/indicatordata/exporttocsv/:ids', management.indicatordata_exporttocsv);
  
  // meta data
  app.get('/management/metadata', management.metadata);
  app.get('/management/metadata/list/', management.metadata_list);
  app.post('/management/metadata/update', management.metadata_update);
  app.post('/management/metadata/values/update', management.metadata_values_update);

  // area data
  app.get('/management/areadata', management.areadata);
  app.get('/management/areadata/list/', management.areadata_list);
  app.post('/management/areadata/update', management.areadata_update);

  // target data
  app.get('/management/targetdata', management.targetdata);
  app.get('/management/targetdata/list/', management.targetdata_list);
  app.post('/management/targetdata/update', management.targetdata_update);

  // catalog data
  app.get('/management/catalogdata', management.catalogdata);
  app.get('/management/catalogdata/list/', management.catalogdata_list);
  app.post('/management/catalogdata/update', management.catalogdata_update);
};
