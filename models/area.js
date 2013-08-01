var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
 
var AreaDataSchema = new Schema({
	_id: { type: ObjectId, index: true },
	 NameLoc: { type: Array },
});

mongoose.model('AreaData', AreaDataSchema, 'AreaData');