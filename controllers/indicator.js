var Indicator = require('../proxy').Indicator;
var Combined = require('../proxy').Combined;
var Target = require('../proxy').Target;
var Meta = require('../proxy').Meta;
var config = require('../config').config
var csv = require('csv');
var fs = require('fs');
var TargetCtrl = require('./target');

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
		Combined.getCombinedByID(data1.CombinedDataID, function(err, combineddata){
			if (combineddata == null) {
				Combined.newAndSave(data1.NameLoc.Chinese, data1.NameLoc.Chinese, 0, {"IndicatorID" : id},
				 function(err, data2){
					Indicator.setCombinedDataIDByID(id, data2._id, function(error, rows){
						callback(err, data1);
					});
				});
			};
		})
	});
};

exports.ExportToCSV = function(id, callback){
	Indicator.getIndicatorByID(id, function(err1, indicatordata){
		if (err1) {
			console.log(err1);
			return next(err1);
		};
		Combined.getCombinedByID(indicatordata.CombinedDataID, function(err2, combineddata){
			if (err2) {
				console.log(err2);
				return next(err2);
			};
			Target.getTargetByID(indicatordata.SrcTargetID, function(err3, targetdata){
				if (err3) {
					console.log(err3);
					return next(err3);
				};
				Meta.getMetaDataByID(indicatorid, {}, options, function (err4, Metas) {
				     if (err4) {
				      return next(err4);
				    }

				    var data = [];
					var line = '', NameLoc = '', NoteLoc = '', SrcTargetName;
					if(indicatordata.NameLoc != undefined) {NameLoc = indicatordata.NameLoc.Chinese; }
					if(combineddata.NoteLoc != undefined) {NoteLoc = combineddata.NameLoc.Chinese; }
					if(targetdata.NameLoc != undefined) {SrcTargetName = targetdata.NameLoc.Chinese; }
					// title
					line = ',' + NameLoc + ',' + NoteLoc + ',' + SrcTargetName;
					data.push(line);
					for (var i = Metas.length - 1; i >= 0; i--) {
				      Metas[i]['AreaNameLoc'] = AreaCtrl.GetAreaNameLoc(Metas[i]['AreaID'], 'Chinese');
				      Metas[i]['Target1NameLoc'] = TargetCtrl.GetTargetNameLoc(Metas[i]['Target1ID'], 'Chinese');
				      Metas[i]['Target2NameLoc'] = TargetCtrl.GetTargetNameLoc(Metas[i]['Target2ID'], 'Chinese');
				    };
					var fout=fs.createWriteStream(config.export_csv_path + '\\' +NameLoc +'.csv');
					fout.write(new Buffer('\xEF\xBB\xBF','binary'));//add utf-8 bom
					csv() .from.array(data) .to(fout);
				});
			});
		});
	});
};

