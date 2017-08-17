var User = require('../models/user');

module.exports = function(router) {

  router.post('/users', function(req, res) {
    var user = new User();
    user.email = req.body.email;
    user.password = req.body.password;
    user.firstName = req.body.firstName;
    if (req.body.email == null || req.body.email == '' || req.body.password == null || req.body.password == '' || req.body.firstName == null || req.body.firstName == '' ) {
      res.json({
        success: false,
        message: 'Please provide a valid email, name and password.'
      });
    } else {
      user.save(function(err) {
        if (err) {
          res.json({
            success: false,
            message: 'This email is taken.'
          });
        } else {
          res.json({
            success: true,
            message: 'User created!'
          });
        }
      });
    }
  });

  return router;

}
