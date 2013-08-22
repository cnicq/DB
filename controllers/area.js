var Area = require('../proxy').Area;
var Areas = {};

exports.Areas = Areas;

exports.GetAreas = function() {
	Area.getAreas(function (err, Datas) {
		exports.Areas = {};
		for (var i = Datas.length - 1; i >= 0; i--) {
			exports.Areas[Datas[i]._id] = Datas[i].NameLoc.Chinese;
		}
	});
};

exports.GetAreaNameLoc = function(id, loc) {
	var name = exports.Areas[id];
	if (name == undefined || name == '') {
		Area.getAreaByID(id, function (err, Data) {
			if (err) {
		      return name;
		    }
			exports.Areas[id] = Data.NameLoc[loc];

			if (exports.Areas[id] == undefined || exports.Areas[id] == '') {
				if (loc == 'Chinese') {exports.Areas[id] = Data.NameLoc['English'];}
				else {exports.Areas[id] = Data.NameLoc['Chinese'];}
			};
		});
	}

	return exports.Areas[id];
}