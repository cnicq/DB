var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
 
var MetaDataSchema = new Schema({
	AreaID: { type: ObjectId},
	Target1ID: { type: ObjectId},
	Target2ID: { type: ObjectId},
	Period: { type: String},
	Datas:{ type:Array},
	// for display
	AreaNameLoc: { Chinese : {type:String}, English : {type:String} },
	Target1NameLoc: { Chinese : {type:String}, English : {type:String} },
	Target2NameLoc: { Chinese : {type:String}, English : {type:String} },
});

exports.MetaModel = function(id){
	return mongoose.model('MetaData', MetaDataSchema, 'MetaData_' + id);
}
