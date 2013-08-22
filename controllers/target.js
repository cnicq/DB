var Target = require('../proxy').Target;
var Targets = {};

exports.Targets = Targets;

exports.GetTargets = function() {
	Target.getTargets(function (err, Datas) {
		exports.Targets = {};
		for (var i = Datas.length - 1; i >= 0; i--) {
			exports.Targets[Datas[i]._id] = Datas[i].NameLoc.Chinese;
		}
	});
};

exports.GetTargetNameLoc = function(id, loc) {
	if (id == '' || id == null || id == undefined) {
		return undefined;
	};
	var name = exports.Targets[id];
	if (name == undefined) {
		Target.getTargetByID(id, function (err, Data) {
			if (err) {
		      return name;
		    }
		    if (Data.NameLoc != undefined) {exports.Targets[id] = Data.NameLoc[loc];}
		    else exports.Targets[id] = undefined;

		    if (exports.Targets[id] == undefined || exports.Targets[id] == '') {
				if (loc == 'Chinese') {exports.Targets[id] = Data.NameLoc['English'];}
				else {exports.Targets[id] = Data.NameLoc['Chinese'];}
			};
			
		});
	}

	return exports.Targets[id];
}