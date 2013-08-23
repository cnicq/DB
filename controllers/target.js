var Target = require('../proxy').Target;
var Targets = {};

exports.Targets = Targets;

exports.GetTargets = function() {
	Target.getTargets(function (err, Datas) {
		exports.Targets = {};
		for (var i = Datas.length - 1; i >= 0; i--) {
			exports.Targets[Datas[i]._id] = Datas[i];
		}
	});
};

exports.GetTargetNameLoc = function(id, loc) {
	if (id == '' || id == null || id == undefined) {
		return undefined;
	};
	
	var name = exports.Targets[id];

	if(name != undefined){
		return exports.Targets[id].NameLoc[loc];	
	} 

	if (name == undefined) {
		Target.getTargetByID(id, function (err, Data) {
			if (err) {
		      return name;
		    }

		    exports.Targets[id] = Data;
		    return Data.NameLoc[loc];
		});
	}
}