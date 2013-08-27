var Indicator = require('../proxy').Indicator;
var Combined = require('../proxy').Combined;
var Target = require('../proxy').Target;
var Meta = require('../proxy').Meta;
var config = require('../config').config
var csv = require('csv');
var fs = require('fs');
var TargetCtrl = require('./target');
var AreaCtrl = require('./area');
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
				Meta.getMetaDataByID(indicatordata['_id'], {}, {}, function (err4, Metas) {
				     if (err4) {
				      return next(err4);
				    }

				    var data = [];
				    var target1s = {};
				    var target2s = {};
				    var areas = {};
				    var lines = {};
					var line = '', NameLoc = '', NoteLoc = '', SrcTargetName;
					var nAreas = 0, nTarget1s = 0, nTarget2s = 0;
					if(indicatordata.NameLoc != undefined) {NameLoc = indicatordata.NameLoc.Chinese; }
					if(combineddata.NoteLoc != undefined) {NoteLoc = combineddata.NameLoc.Chinese; }
					if(targetdata.NameLoc != undefined) {SrcTargetName = targetdata.NameLoc.Chinese; }

					// title
					line = ',' + NameLoc + ',' + NoteLoc + ',' + SrcTargetName;
					data.push(line);
					for (var i = Metas.length - 1; i >= 0; i--) {
						if(Metas[i]['Datas'] == undefined || Metas[i]['Datas'].length == 0) continue;
						var area = '', target1 = '', target2 = '';
						area = areas[Metas[i]['AreaID']];
						if (area == undefined) {
							area = AreaCtrl.GetAreaNameLoc(Metas[i]['AreaID'], 'Chinese');
							areas[Metas[i]['AreaID']] = nAreas;
							nAreas += 1;
						}
						target1 = target1s[Metas[i]['Target1ID']] ;
						if(target1 == undefined) {
							target1 = TargetCtrl.GetTargetNameLoc(Metas[i]['Target1ID'], 'Chinese');
							target1s[Metas[i]['Target1ID']] = target1;
							nTarget1s += 1;
						}

						target2 = target1s[Metas[i]['Target2ID']] ;
						if(target2 == undefined) {
							target2 = TargetCtrl.GetTargetNameLoc(Metas[i]['Target2ID'], 'Chinese');
							target2s[Metas[i]['Target2ID']] = target2;
							nTarget2s += 1;
						}
				    }

				    if (nTarget2s > 0) {
				    	var key = '';
				    	for (var i = Metas.length - 1; i >= 0; i--) {
				    		for (var j = Metas[i]['Datas'].length - 1; j >= 0; j--) {
				    			key = Metas[i]['Target1ID'] + ':' + Metas[i]['AreaID'];
								if(lines[Metas[i]['Datas'][j].Date]['key'] == undefined){
									lines[Metas[i]['Datas'][j].Date]['key'] = new array(nTarget2s);
								}
							}
				    	}
				    };

				    
				    console.log(areas);
				    console.log(target1s);
				    console.log(target2s);
					var fout=fs.createWriteStream(config.export_csv_path + '\\' +NameLoc +'.csv');
					fout.write(new Buffer('\xEF\xBB\xBF','binary')); //add utf-8 bom
					csv() .from.array(data) .to(fout);
				});
			});
		});
	});
};

