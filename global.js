// Global cached datas
var Area = require('./controllers/area');
var Target = require('./controllers/target');
var Catalog = require('./controllers/catalog');

module.exports = function(app){
  // Fetch and Cache Global Datas
  Area.GetAreas();
  Target.GetTargets();
  Catalog.GetCatalogs();
};

