var Indicator = require('../proxy').Indicator;

exports.newest = function(req, res, next){
	var opt = {limit: 100};
	Indicator.getIndicatorsByQuery({}, opt, function (err, indicators) {
		if (err) {
		  return next(err);
		}

		res.send(indicators);
	});
};

exports.hotest = function(req, res){
  	res.send("respond with a hotest resource");
};
