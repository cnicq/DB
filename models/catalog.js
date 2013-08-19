var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
 
var CatalogDataSchema = new Schema({
	_id: { type: ObjectId, index: true },
	 Name: { type: String },
	 ParentName: { type: String },
	 NameLoc: { type: Array },
});

mongoose.model('CatalogData', CatalogDataSchema, 'CatalogData');