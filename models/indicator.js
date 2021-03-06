var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
 
var IndicatorDataSchema = new Schema({
  NameLoc: { Chinese : {type:String}, English : {type:String} },
  SrcTargetID: { type: ObjectId },
  CombinedDataID: { type: ObjectId },
  SrcURL:{ URL : {type : String }, MD5:{ type : String}},
  Keywords : {type : Array},

  // for display
  SrcTargetName: { Chinese : {type:String}, English : {type:String} },

});

mongoose.model('IndicatorData', IndicatorDataSchema, 'IndicatorData');
