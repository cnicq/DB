var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
 
var TargetDataSchema = new Schema({
	 NameLoc: { Chinese : {type:String}, English : {type:String} },
});

mongoose.model('TargetData', TargetDataSchema, 'TargetData');