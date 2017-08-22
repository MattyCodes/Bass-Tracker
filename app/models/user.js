var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var titlize  = require('mongoose-title-case');
var bcrypt   = require('bcrypt-nodejs');
var Schema   = mongoose.Schema;

var firstNameValidator = [

  validate({
    validator: 'matches',
    arguments: /^[a-zA-Z ]+$/,
    message: 'Name can only include letters and spaces.'
  }),

  validate({
    validator: 'isLength',
    arguments: [3, 20],
    message: 'Name must be between three and twenty letters long.'
  })

];

var emailValidator = [

  validate({
    validator: 'isEmail',
    message: 'Must provide valid email address.'
  }),

  validate({
    validator: 'isLength',
    arguments: [3, 50],
    message: 'Email must be between three and fifty characters.'
  })

];

var passwordValidator = [

  validate({
    validator: 'matches',
    arguments: /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{6,20}$/,
    message: 'Password must include letters and at least one number.'
  }),

  validate({
    validator: 'isLength',
    arguments: [6, 20],
    message: 'Password must be between six and twenty characters.'
  })

];

var userSchema = new Schema({
  email: { type: String, required: true, lowercase: true, unique: true, validate: emailValidator },
  password: { type: String, required: true, validate: passwordValidator },
  firstName: { type: String, required: true, validate: firstNameValidator },
  fbAccount: { type: Boolean, required: true, default: false }
});

userSchema.pre('save', function(next) {
  var user = this;
  bcrypt.hash(user.password, null, null, function(err, hash) {
    if (err) return next(err);
    user.password = hash;
    next();
  });
});

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}

userSchema.plugin(titlize, {
  paths: [ 'firstName' ]
});

module.exports = mongoose.model('User', userSchema);
