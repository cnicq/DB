var models = require('../models');
var Meta = models.Meta;
var mongoose = require('mongoose');
var Utility = require('../lib/Utility');

exports.getMetaDataByID = function (id, query, opt, callback) {
  	Meta(id).find(query, "", opt, callback);
};

exports.dropMetaCollection = function(id, callback){
	mongoose.connection.db.dropCollection("MetaData_" + id, callback);
}

exports.getCountByQuery = function (id, query, callback) {
  	Meta(id).count(query, callback);
};

exports.newAndSave = function (indicatorid, AreaID, Target1ID, Target2ID, Period, callback) {
	var com = new Meta(indicatorid)();
	com.AreaID = AreaID;
	if (Target1ID != '') { com.Target1ID = Target1ID; };
	if (Target2ID != '') { com.Target1ID = Target1ID; };
	com.Period = Period;

	com.save(function (err, com) {
		callback(err, com);
	});
};

exports.delMetaDataByID = function(indicatorid, id, callback){
  Meta(indicatorid).remove({_id:id}, callback);
}

exports.addValue = function(indicatorid, id, TheDate, TheValue, callback){
	Meta(indicatorid).update({_id:id}, {$push : {Datas : {Date:TheDate,Value:TheValue, UpdateDate: Utility.format_date(new Date())}}}, callback);	
}

exports.updateValue = function(indicatorid, id, TheDate, NewValue, callback){
	Meta(indicatorid).update({_id:id,Datas:{$elemMatch: {Date:TheDate}}}, 
		{$set : {Datas : {Value:NewValue, Date:TheDate, UpdateDate: Utility.format_date(new Date())}}}, callback);	
}

exports.removeValue = function(indicatorid, id, TheDate, callback){
	Meta(indicatorid).update({_id:id}, {$pull : {Datas :{Date:TheDate}}}, callback);	
}