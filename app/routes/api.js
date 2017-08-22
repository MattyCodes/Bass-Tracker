var User      = require('../models/user');
var jwt       = require('jsonwebtoken');
var secret    = '200154321';

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
          if (err.errors != null) {
            if (err.errors.firstName) {
              res.json({ success: false, message: err.errors.firstName.message });
            } else if (err.errors.email) {
              res.json({ success: false, message: err.errors.email.message });
            } else if (err.errors.password) {
              res.json({ success: false, message: err.errors.password.message });
            }
          } else {
            res.json({ success: false, message: 'This email is already in use.' });
          }
        } else {
          res.json({
            success: true,
            message: 'User created!'
          });
        }
      });
    }
  });

  router.put('/users', function(req, res) {

    if (req.body.email == null || req.body.email == '' || req.body.password == null || req.body.password == '' || req.body.firstName == null || req.body.firstName == '' ) {
      res.json({
        success: false,
        message: 'Please provide a valid email, name and password.'
      });
    } else {
      User.findOne({ _id: req.body.id }, function(err, user) {
        if (err) throw err;
        if (user) {
          var validPassword = user.comparePassword(req.body.password);
          if (!validPassword) {
            res.json({ success: false, message: 'Incorrect password.' });
          } else {
            user.email     = req.body.email;
            user.firstName = req.body.firstName;
            user.password  = req.body.password;
            user.save(function(err) {
              if (err) {
                if (err.errors != null) {
                  if (err.errors.firstName) res.json({ success: false, message: err.errors.firstName.message });
                  if (err.errors.email) res.json({ success: false, message: err.errors.email.message });
                } else {
                  res.json({ success: false, message: err });
                }
              } else {
                var token = jwt.sign({ id: user._id, email: user.email, name: user.firstName }, secret, { expiresIn: '24h' });
                res.json({ success: true, message: 'Account updated.', token: token });
              }
            });
          }
        } else {
          res.json({ success: false, message: 'There is no user. - Logging out...', nullUser: true });
        }
      });
    }

  });

  router.delete('/users/:id/:password', function(req, res) {
    if (req.params.password && req.params.password != 'nullPassword') {
      User.findOne({ _id: req.params.id }).select('password').exec(function(err, user) {
        if (err) throw err;
        if (user) {
          var validPassword = user.comparePassword(req.params.password);
          if (!validPassword) {
            res.json({ success: false, message: 'Incorrect password.' });
          } else {
            user.remove();
            res.json({ success: true, message: 'Account deleted.' });
          }
        } else {
          res.json({ success: false, message: 'There is no user. - Logging out...', nullUser: true });
        }
      });
    } else {
      res.json({ success: false, message: 'Password must be provided.' });
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
            var token = jwt.sign({ id: user._id, email: user.email, name: user.firstName }, secret, { expiresIn: '24h' });
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
