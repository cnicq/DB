var Area = require('../proxy').Area;
var Areas = {};

exports.Areas = Areas;

exports.GetAreas = function() {
	Area.getAreas(function (err, Datas) {
		exports.Areas = {};
		for (var i = Datas.length - 1; i >= 0; i--) {
			exports.Areas[Datas[i]._id] = Datas[i];
		}
	});
};

exports.GetAreaNameLoc = function(id, loc) {
	var name = exports.Areas[id];
	if (id == null || id == '' || id == undefined) {
		return name;
	};

	var name = exports.Areas[id];

	if(name != undefined){
		return exports.Areas[id].NameLoc[loc];	
	} 

	if (name == undefined || name == null) {
		Area.getAreaByID(id, function (err, Data) {
			if (err) {
		      return name;
		    }
			exports.Areas[id] = Data;
			return Data.NameLoc[loc];
		});
	}
}