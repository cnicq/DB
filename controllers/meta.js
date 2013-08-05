var Meta = require('../proxy').Meta;
var Area = require('./area');

exports.id = function(req, res, next){
	var _id = req.params.id;
	Meta.getMetaDataByID(_id, function (err, MetaDatas) {
		if (err) {
		  return next(err);
		}
		var datas = MetaDatas;
		for (var i = MetaDatas.length - 1; i >= 0; i--) {
	    	datas[i]['AreaNameLoc'] = Area.GetAreaChineseName(datas[i]['AreaID']);
      	}
      	
		res.send(datas);
	});
};
