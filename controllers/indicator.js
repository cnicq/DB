var Indicator = require('../proxy').Indicator;
var Combined = require('../proxy').Combined;
var Meta = require('../proxy').Meta;

exports.DelIndicator = function(id, callback){
	Indicator.getIndicatorByID(id, function(err, data){
		// delete related combied data
		if (data['CombinedDataID'] != undefined ) {
			Combined.delCombinedByID(data['CombinedDataID'], function(err, rows){});
		};
		// drop related meta data collection
		Meta.dropMetaCollection(id, function(error, result) {});
		// remove indicator record
		Indicator.delIndicatorByID(id, callback);
	});
}

exports.RefreshDefaultCombinedData = function(id, callback){
	Indicator.getIndicatorByID(id, function(err, data1){
		Combined.newAndSave(data1.NameLoc.Chinese, data1.NameLoc.Chinese, 0, {"IndicatorID" : id},
		 function(err, data2){
			Indicator.setCombinedDataID(id, data2._id, function(error, rows){
				callback(err, data1);
			});
		});
	});
};
