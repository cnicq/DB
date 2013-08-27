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
					data.push(line + ',\r\n');
					for (var i = Metas.length - 1; i >= 0; i--) {
						if(Metas[i]['Datas'] == undefined || Metas[i]['Datas'].length == 0) continue;
						var area = '', target1 = '', target2 = '';
						if (Metas[i]['AreaID'] !='' && Metas[i]['AreaID'] != undefined && areas[Metas[i]['AreaID']] == undefined) {
							
							areas[Metas[i]['AreaID']] = nAreas;
							nAreas += 1;
						}
						target1 = target1s[Metas[i]['Target1ID']] ;
						if(Metas[i]['Target1ID'] !='' && Metas[i]['Target1ID'] != undefined && target1 == undefined) {
							
							target1s[Metas[i]['Target1ID']] = nTarget1s;
							nTarget1s += 1;
						}

						target2 = target2s[Metas[i]['Target2ID']] ;
						if(Metas[i]['Target2ID'] !='' && Metas[i]['Target2ID'] != undefined && target2 == undefined) {
							target2s[Metas[i]['Target2ID']] = nTarget2s;
							nTarget2s += 1;
						}
				    }
				    data.push(',,,\r\n');

				    if (nTarget2s > 0) {
				    	var key = '';
				    	for (var i = Metas.length - 1; i >= 0; i--) {
				    		for (var j = Metas[i]['Datas'].length - 1; j >= 0; j--) {
				    			key = Metas[i]['Target1ID'] + ':' + Metas[i]['AreaID'];
				    			if (lines[Metas[i]['Datas'][j].Date] == undefined) {
				    				lines[Metas[i]['Datas'][j].Date] = {};
				    			};
								if(lines[Metas[i]['Datas'][j].Date][key] == undefined){
									lines[Metas[i]['Datas'][j].Date][key] = new Array(nTarget2s);
								}
								lines[Metas[i]['Datas'][j].Date][key][target2s[Metas[i]['Target2ID']]] = Metas[i]['Datas'][j].Value;
							}
				    	}

				    	if (nTarget1s == 0 && nAreas > 0) {
				    	line = "时间,地区,"; 
					    };
					    if (nTarget2s > 0) {
					    	for(key in target2s){
					    		line += TargetCtrl.GetTargetNameLoc(key, 'Chinese') +','; 
					    	}
					    };
					    data.push(line + '\r\n');
					    for(var key in lines){
					    	for(var key2 in lines[key]){
					    		var key2s = key2.split(':');
					    		line = key + ',';
					    		if (key2s[0] != 'undefined') {
					    			line += TargetCtrl.GetTargetNameLoc(key2s[0], 'Chinese') +',';	
					    		};
					    		if (key2s[1] != 'undefined') {
					    			line += AreaCtrl.GetAreaNameLoc(key2s[1], 'Chinese') +',';	
					    		};
					    		for (var i = 0; i < lines[key][key2].length; i++) {
					    			if(lines[key][key2][i] != undefined){
					    				line += lines[key][key2][i] + ',';
					    			}
					    		};
					    		data.push(line + '\r\n');	
					    	}
					    }
				    }

					var fout=fs.createWriteStream(config.export_csv_path + '\\' +NameLoc +'.csv', {encoding: 'utf8'});
					//fout.write(new Buffer('\xEF\xBB\xBF','binary')); //add utf-8 bom
					csv() .from.array(data) .to(fout);
				});
			});
		});
	});
};

