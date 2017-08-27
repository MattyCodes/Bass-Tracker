var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var titlize  = require('mongoose-title-case');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Schema   = mongoose.Schema;

var fishSchema = new Schema({
  type: { type: String, default: 'Unknown' },
  lure: { type: String, default: 'Unknown' },
  description: { type: String, default: 'Unknown' },
  image: { type: String, default: 'fish_default.jpg' },
  userId: { type: String, required: true }
});

fishSchema.plugin(titlize, {
  paths: [ 'type', 'lure' ]
});

module.exports = mongoose.model('Fish', fishSchema);
