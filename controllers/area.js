var Area = require('../proxy').Area;
var Areas = {};

exports.Areas = Areas;

exports.GetAreas = function() {
	Area.getAreas(function (err, Datas) {
		exports.Areas = {};
		for (var i = Datas.length - 1; i >= 0; i--) {
			exports.Areas[Datas[i]._id] = Datas[i].NameLoc[0]['Chinese'];
		}
	});
};

exports.GetAreaChineseName = function(id) {
	var name = exports.Areas[id];
	if (name == undefined) {
		Area.getAreaByID(id, function (err, Data) {
			if (err) {
		      return name;
		    }
			exports.Areas[id] = Data.NameLoc[0]['Chinese'];
		});
	}

	return exports.Areas[id];
}