var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
 
var MetaDataSchema = new Schema({
	_id: { type: ObjectId, index: true },
	AreaID: { type: ObjectId},
	Target1ID: { type: ObjectId},
	Target2ID: { type: ObjectId},
	Period: { type: String},
	// for display
	AreaNameLoc: { type: String},
	Target1NameLoc: { type: String},
	Target2NameLoc: { type: String},
});

exports.MetaModel = function(id){
	return mongoose.model('MetaData', MetaDataSchema, 'MetaData_' + id);
}
