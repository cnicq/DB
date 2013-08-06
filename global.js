// Global cached datas
var Area = require('./controllers/area');
var Target = require('./controllers/target');


module.exports = function(app){
  // Fetch and Cache Global Datas
  Area.GetAreas();
  Target.GetTargets();
};

