var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
 
var IndicatorDataSchema = new Schema({
  NameLoc: { Chinese : {type:String}, English : {type:String} },
  StrTargetID: { type: ObjectId },
  CombinedDataID: { type: ObjectId },
});

mongoose.model('IndicatorData', IndicatorDataSchema, 'IndicatorData');
