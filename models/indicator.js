var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
 
var IndicatorDataSchema = new Schema({
  _id: { type: ObjectId, index: true },
  NameLoc: { type: Array },
  StrTargetID: { type: ObjectId },
});

mongoose.model('IndicatorData123', IndicatorDataSchema);
