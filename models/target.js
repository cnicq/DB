var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
 
var TargetDataSchema = new Schema({
	 NameLoc: { Chinese : {type:String}, English : {type:String} },
	 Type:{type: String},
	 NoteLoc: { Chinese : {type:String}, English : {type:String} },
	 URL:{type:String}
});

mongoose.model('TargetData', TargetDataSchema, 'TargetData');