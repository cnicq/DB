var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
 
var CombinedDataSchema = new Schema({
	_id: { type: ObjectId, index: true },
	NameLoc: { type: Array },
	Conditions: { type: Array },
	CombinedType: { type: Number },
});

mongoose.model('CombinedData', CombinedDataSchema, 'CombinedData');
