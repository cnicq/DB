var Catalog = require('../proxy').Catalog;
var Catalogs = {};
exports.Catalogs = Catalogs;

exports.GetCatalogs = function() {
	Catalog.getCatalogs(function (err, Datas) {
		exports.Catalogs = {};
		for (var i = Datas.length - 1; i >= 0; i--) {
			if (Datas[i].ParentName == "" || Datas[i].ParentName  == undefined) {
				if (exports.Catalogs[Datas[i].Name] == undefined) {
					exports.Catalogs[Datas[i].Name] = [];
				};
				exports.Catalogs[Datas[i].Name].push(Datas[i]);
			}
			else{
				if (exports.Catalogs[Datas[i].ParentName] == undefined) {
					exports.Catalogs[Datas[i].ParentName] = [];
				};
				exports.Catalogs[Datas[i].ParentName].push(Datas[i]);
			}
		}
	});

};

exports.datas = function(req, res, next){
	res.send(exports.Catalogs);
};