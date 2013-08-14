var Combined = require('../proxy').Combined;
var Meta = require('../proxy').Meta;
var Area = require('./area');
var Target = require('./target');
var Indicator = require('../proxy').Indicator;

exports.byid = function(req, res, next){

	var _id = req.params.id;
	if (_id == "") {
		return res.send('can not find');
	};

	Combined.getCombinedByID(_id, function (err, data) {
		if (err) {
			return next(err);
		}

		if (data['CombinedType'] == 0 && data['Conditions'][0]['IndicatorID'] != "") {
			Meta.getMetaDataByID(data['Conditions'][0]['IndicatorID'] , function (err, MetaDatas) {
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
		      	Indicator.getIndicatorByID(data['Conditions'][0]['IndicatorID'] , function(error, IndicatorData) {
		      		datas['IndicatorData'] = IndicatorData;
		      		datas['CombinedData'] = data;
		      		return res.send(datas);
		      	});
			
			});
		};
	});
};

exports.newest = function(req, res, next){
	var opt = {limit: 10};

	Combined.getCombinedsByQuery({}, opt, function (err, combineds) {
		if (err) {
			return next(err);
		}

		res.send(combineds);
	});
};
