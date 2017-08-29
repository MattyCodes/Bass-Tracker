var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var titlize  = require('mongoose-title-case');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Schema   = mongoose.Schema;

var descriptionValidator = [

  validate({
    validator: 'isLength',
    arguments: [0, 300],
    message: 'Description must be under three hundred characters.'
  })

];

var typeValidator = [

  validate({
    validator: 'isLength',
    arguments: [0, 26],
    message: 'Type must be under twenty six characters.'
  })

];

var lureValidator = [

  validate({
    validator: 'isLength',
    arguments: [0, 22],
    message: 'Lure must be under twenty two characters.'
  })

];

var fishSchema = new Schema({
  type: { type: String, default: 'Unknown', validate: typeValidator },
  lure: { type: String, default: 'Unknown', validate: lureValidator },
  description: { type: String, default: 'Unknown', validate: descriptionValidator },
  image: { type: String, default: 'fish_default.png' },
  userId: { type: String, required: true }
});

fishSchema.plugin(titlize, {
  paths: [ 'type', 'lure' ]
});

module.exports = mongoose.model('Fish', fishSchema);
