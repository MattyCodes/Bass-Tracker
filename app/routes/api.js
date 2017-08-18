var User   = require('../models/user');
var jwt    = require('jsonwebtoken');
var secret = '200154321';

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

  router.post('/login', function(req, res) {
    User.findOne({ email: req.body.email }).select('_id email firstName password').exec(function(err, user) {
      if (err) throw err;

      if (!user) {
        res.json({ success: false, message: 'Could not authenticate user.' });
      } else if (user) {
        if (req.body.password) {
          var validPassword = user.comparePassword(req.body.password);
          if (!validPassword) {
            res.json({ success: false, message: 'Could not validate password.' });
          } else {
            var token = jwt.sign({ id: user._id, name: user.firstName }, secret, { expiresIn: '24h' });
            res.json({ success: true, message: 'User authenticated!', token: token });
          }
        } else {
          res.json({ success: false, message: 'No password provided.' });
        }
      }
    });
  });

  router.use(function(req, res, next) {
    var token = req.body.token || req.body.query || req.headers['x-access-token'];

    if (token) {
      jwt.verify(token, secret, function(err, decoded) {
        if (err) {
          res.json({ success: false, message: 'Invalid token.' });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      res.json({ success: false, message: 'No token provided.' });
    }

  });

  router.post('/currentuser', function(req, res) {
    res.send(req.decoded);
  });

  return router;

}
