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
  app.get('/combined/catalog/:catalog', combined.catalog);
  app.get('/combined/byid/:id', combined.byid);
  app.get('/catalog', catalog.datas);
  

  // management
  app.get('/management', management.index);
  app.get('/management/combineddata', management.combineddata);
  app.get('/management/combineddata/list/', management.combineddata_list);
  app.get('/management/RemoveAllMetaCollections', management.remove_meta_collections);
  app.post('/management/combineddata/update', management.combineddata_update);
};
