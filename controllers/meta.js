var Meta = require('../proxy').Meta;
var Area = require('./area');
var Target = require('./target');
var Indicator = require('../proxy').Indicator;

exports.id = function(req, res, next){
	var _id = req.params.id;
	Meta.getMetaDataByID(_id, function (err, MetaDatas) {
		if (err) {
		  return next(err);
		}
		
		var datas = {};
		for (var i = MetaDatas.length - 1; i >= 0; i--) {
	    	MetaDatas[i]['AreaNameLoc'] = Area.GetAreaChineseName(MetaDatas[i]['AreaID']);
	    	MetaDatas[i]['Target1NameLoc'] = Target.GetTargetChineseName(MetaDatas[i]['Target1ID']);
	    	MetaDatas[i]['Target2NameLoc'] = Target.GetTargetChineseName(MetaDatas[i]['Target2ID']);
      	}
      	datas['MetaDatas'] = MetaDatas;
      	Indicator.getIndicatorByID(_id, function(error, IndicatorData) {
      		var data2 = {};
      		data2['IndicatorData'] = IndicatorData;
      		data2['MetaDatas'] = datas['MetaDatas'];
      		res.send(data2);
      	});
		
	});
};
