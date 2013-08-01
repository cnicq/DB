var Meta = require('../proxy').Meta;
var Area = require('./area');

exports.id = function(req, res, next){
	var _id = req.params.id;
	Meta.getMetaDataByID(_id, function (err, MetaDatas) {
		if (err) {
		  return next(err);
		}
		
		for (var i = MetaDatas.length - 1; i >= 0; i--) {
	    	MetaDatas[i]['AreaNameLoc'] = Area.GetAreaChineseName(MetaDatas[i]['AreaID']);
      	}

		res.send(MetaDatas);
	});
};
