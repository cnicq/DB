var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
 
var CatalogDataSchema = new Schema({
	 Name: { type: String },
	 ParentName: { type: String },
	 NameLoc: { Chinese : {type:String}, English : {type:String} },
});

mongoose.model('CatalogData', CatalogDataSchema, 'CatalogData');