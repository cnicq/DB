var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
 
var CombinedDataSchema = new Schema({
	NameLoc: { Chinese : {type:String}, English : {type:String} },
	Conditions: { type: Array },
	CombinedType: { type: Number },
	UpdateTime: { type: String },
	NoteLoc: { Chinese : {type:String}, English : {type:String} },
	Views:{ type:Number, default:0 },
	CatalogNames: { type: Array },
});

mongoose.model('CombinedData', CombinedDataSchema, 'CombinedData');
