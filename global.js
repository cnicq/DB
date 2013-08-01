// Global cached datas
var Area = require('./controllers/area');



module.exports = function(app){
  // Fetch and Cache AreaDatas
  Area.GetAreas();
};

