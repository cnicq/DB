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

		      		// add view
		      		Combined.increaseViews(_id, function(err, numAffect){
		      			if (err) {
				  			return next(err);
						}
		      		});

		      		return res.send(datas);
		      	});
			
			});
		};
	});
};

exports.newest = function(req, res, next){
	var limit = 10;
	var page = req.params.page;
	if (page == undefined) {
		page = 0;
	};
	
	var options = { skip: (page) * limit, limit: limit, sort: [ ['UpdateTime', 'desc' ]] };
	Combined.getCombinedsByQuery({}, options, function (err, combineds) {
		if (err) {
			return next(err);
		}

		res.send(combineds);
	});
};

exports.hotest = function(req, res, next){
	var limit = 10;
	var page = req.params.page;
	if (page == undefined) {
		page = 0;
	};
	
	var options = { skip: (page) * limit, limit: limit, sort: [ ['Views', 'desc' ]] };
	Combined.getCombinedsByQuery({}, options, function (err, combineds) {
		if (err) {
			return next(err);
		}
		res.send(combineds);
	});
};

exports.search = function(req, res, next){
	var keyword = req.params.keyword;
	var regularExpression = new RegExp(".*" + keyword + ".*");
	var conditions = { "NameLoc.Chinese" : regularExpression};
	var options = { sort: [ ['UpdateTime', 'desc' ]] };
	Combined.getCombinedsByQuery(conditions, options, function (err, combineds) {
		if (err) {
			return next(err);
		}
		res.send(combineds);
	});
};