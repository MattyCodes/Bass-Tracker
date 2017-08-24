var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var titlize  = require('mongoose-title-case');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Schema   = mongoose.Schema;

var fishSchema = new Schema({
  type: { type: String, default: 'Unknown' },
  lure: { type: String, required: true },
  description: { type: String, default: 'None' },
  imageURL: { type: String, default: 'assets/images/fish_default.jpg' }
});

fishSchema.plugin(titlize, {
  paths: [ 'type', 'lure' ]
});

module.exports = mongoose.model('Fish', fishSchema);
