var index = require('./controllers/index');
var indicator = require('./controllers/indicator');

module.exports = function(app){

  app.get('/', index.index);
  app.get('/indicator/newest', indicator.newest);
};
