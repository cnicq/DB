var index = require('./controllers/index');
var indicator = require('./controllers/indicator');
var meta = require('./controllers/meta');

module.exports = function(app){

  app.get('/', index.index);
  app.get('/indicator/newest', indicator.newest);
  app.get('/indicator/:id', meta.id);
  app.get('/mongodb', index.mongodb);
  app.get('/mongodb/RemoveAllMetaCollections', index.mongodb_remove_meta_collections);
};
