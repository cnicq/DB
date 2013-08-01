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
	return exports.Areas[id];
}