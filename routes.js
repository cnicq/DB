var index = require('./controllers/index');
var indicator = require('./controllers/indicator');
var combined = require('./controllers/combined');

module.exports = function(app){

  app.get('/', index.index);
  app.get('/combined/newest/:page', combined.newest);
  app.get('/combined/:id', combined.byid);
  
  app.get('/mongodb', index.mongodb);
  app.get('/mongodb/RemoveAllMetaCollections', index.mongodb_remove_meta_collections);

};
