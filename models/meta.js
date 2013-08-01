var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
 
var MetaDataSchema = new Schema({
	_id: { type: ObjectId, index: true },
	AreaID: { type: ObjectId},
});

exports.MetaModel = function(id){
	return mongoose.model('MetaData', MetaDataSchema, 'MetaData_' + id);
}
