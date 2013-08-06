var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
 
var TargetDataSchema = new Schema({
	_id: { type: ObjectId, index: true },
	 NameLoc: { type: Array },
});

mongoose.model('TargetData', TargetDataSchema, 'TargetData');