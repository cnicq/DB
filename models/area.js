var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
 
var AreaDataSchema = new Schema({
	 NameLoc: { Chinese : {type:String}, English : {type:String} },
	 AreaType:{type:String}
});

mongoose.model('AreaData', AreaDataSchema, 'AreaData');