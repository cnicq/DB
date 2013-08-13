var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
 
var CombinedDataSchema = new Schema({
  _id: { type: ObjectId, index: true },
  NameLoc: { type: Array },
  Conditons: { type: Array },
});

mongoose.model('CombinedData', CombinedDataSchema, 'CombinedData');
