var User      = require('../models/user');
var Fish      = require('../models/fish');
var jwt       = require('jsonwebtoken');
var secret    = '200154321';
var multer    = require('multer');
var fs        = require('fs')

var storage   = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, __dirname + '/../../public/assets/uploads/images/')
  },
  filename: function(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png|gif|jpeg)$/)) {
      var err = new Error();
      err.code = 'filetype';
      return err;
    } else {
      cb(null, Date.now() + '_' + file.originalname);
    }
  }
});

var upload     = multer({ storage: storage });

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
    if (req.body.email == null || req.body.email == '' || req.body.password == null && !req.body.fb || req.body.password == '' && !req.body.fb || req.body.firstName == null || req.body.firstName == '' ) {
      res.json({
        success: false,
        message: 'Please fill all fields.'
      });
    } else {
      User.findOne({ _id: req.body.id }, function(err, user) {
        if (err) throw err;
        if (user) {
          var validPassword = ( req.body.password ? user.comparePassword(req.body.password) : false );
          if (!validPassword && !req.body.fb) {
            res.json({ success: false, message: 'Incorrect password.' });
          } else {
            // var randomstring = Math.random().toString(36).slice(-10);
            user.email     = req.body.email;
            user.firstName = req.body.firstName;
            user.fbAccount = req.body.fb;
            user.password  = ( req.body.fb ? Math.random().toString(36).slice(-10) : req.body.password );
            user.save(function(err) {
              if (err) {
                if (err.errors != null) {
                  if (err.errors.firstName) res.json({ success: false, message: err.errors.firstName.message });
                  if (err.errors.email) res.json({ success: false, message: err.errors.email.message });
                } else {
                  res.json({ success: false, message: err });
                }
              } else {
                var token = jwt.sign({ id: user._id, email: user.email, name: user.firstName, fbAccount: user.fbAccount }, secret, { expiresIn: '24h' });
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

  router.put('/password', function(req, res) {
    if (req.body.currentPassword == null && !req.body.fb || req.body.currentPassword == '' && !req.body.fb || req.body.newPassword == null || req.body.newPassword == '' || req.body.confirmPassword == null || req.body.confirmPassword == '') {
      res.json({ success: false, message: 'Please fill out all fields correctly' });
    } else {
      User.findOne({ _id: req.body.id }).select('password fbAccount').exec(function(err, user) {
        if (err) throw err;
        if (user) {
          var validPassword = (req.body.fb ? true : user.comparePassword(req.body.currentPassword));
          if (validPassword) {
            if (req.body.newPassword == req.body.currentPassword && !req.body.fb) {
              res.json({ success: false, message: 'New password must be different than the original.' });
            } else {
              var matchingPasswords = (req.body.newPassword == req.body.confirmPassword);
              if (matchingPasswords) {
                user.password  = req.body.newPassword;
                user.fbAccount = (req.body.fb ? false : user.fbAccount);
                user.save(function(err) {
                  if (err) {
                    if (err.errors.password != null) {
                      res.json({ success: false, message: err.errors.password.message });
                    } else {
                      res.json({ success: false, message: err });
                    }
                  } else {
                    res.json({ success: true, message: 'Password successfully updated.' });
                  }
                })
              } else {
                res.json({ success: false, message: 'New password must be confirmed.' });
              }
            }
          } else {
            res.json({ success: false, message: 'Incorrect password.' });
          }
        } else {
          res.json({ success: false, message: 'There is no user. - Logging out...', nullUser: true });
        }
      })
    }
  });

  router.delete('/users/:id/:password', function(req, res) {
    if (req.params.password && req.params.password != 'nullPassword') {
      User.findOne({ _id: req.params.id }).select('_id password fbAccount').exec(function(err, user) {
        if (err) throw err;
        if (user) {
          var validPassword = (user.fbAccount ? true : user.comparePassword(req.params.password));
          if (!validPassword) {
            res.json({ success: false, message: 'Incorrect password.' });
          } else {
            Fish.find({ userId: user._id }, function(err, fish) {
              fish.forEach(function(f) {
                f.remove();
              });
            });
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

  router.get('/users/fish/:id', function(req, res) {
    Fish.find({ userId: req.params.id }).select('_id type lure description image').exec(function(err, fish) {
      if (err) {
        res.json({ fish: null });
      } else {
        res.json({ fish: fish });
      }
    })
  });

  router.get('/fish/:id', function(req, res) {
    Fish.find({ _id: req.params.id }).select('type lure description image').exec(function(err, fish) {
      if (err) {
        res.json({ fish: null });
      } else {
        res.json({ fish: fish });
      }
    })
  });

  router.delete('/fish/:id', function(req, res) {
    Fish.findOne({ _id: req.params.id }, function(err, fish) {
      if (err) {
        res.json({ success: false, message: 'Fish could not be deleted.' });
      } else {
        var imagePath = ( fish.image == 'fish_default.png' ? null : __dirname + '/../../public/assets/uploads/images/' + fish.image);
        fish.remove();
        if (imagePath != null) {
          fs.unlink(imagePath, function(err) {
            res.json({ success: true, message: 'Fish successfully deleted.' });
          });
        } else {
          res.json({ success: true, message: 'Fish successfully deleted.' });
        }
      }
    });
  });

  router.put('/fish/:id', upload.single('imageFile'), function(req, res) {
    if (req.body.type == 'nullInput' || req.body.lure == 'nullInput' || req.body.description == 'nullInput') {
      res.json({ success: false, message: 'Please enter valid input.' });
    } else {
      var fish = Fish.findOne({ _id: req.body.id }).select('type lure description image').exec(function(err, fish) {
        if (!req.body.type && !req.body.lure && !req.body.description && req.file == undefined) {
          res.json({ success: false, message: 'No changes were made.' });
        } else {
          fish.type = ( req.body.type && req.body.type != null ? req.body.type : fish.type );
          fish.lure = ( req.body.lure && req.body.lure != null ? req.body.lure : fish.lure );
          fish.description = ( req.body.description && req.body.description != null ? req.body.description : fish.description );
          if (req.file) {
            var imagePath = ( fish.image == 'fish_default.png' ? null : __dirname + '/../../public/assets/uploads/images/' + fish.image);
            if (imagePath != null) fs.unlink(imagePath);
            fish.image = req.file.filename;
          } else {
            fish.image = fish.image;
          }
          fish.save(function(err) {
            if (err) {
              if (req.file) fs.unlink(req.file.path);
              if (err.errors != null) {
                if (err.errors.type) {
                  res.json({ success: false, message: err.errors.type.message });
                } else if (err.errors.lure) {
                  res.json({ success: false, message: err.errors.lure.message });
                } else if (err.errors.description) {
                  res.json({ success: false, message: err.errors.description.message });
                }
              } else {
                res.json({ success: false, message: 'Unable to update fish.' });
              }
            } else {
              res.json({ success: true, message: 'Fish successfully updated.' });
            }
          });
        }
      });
    }
  });

  router.post('/fish', upload.single('imageFile'), function(req, res) {
    if (req.body.type == 'nullInput' || req.body.lure == 'nullInput' || req.body.description == 'nullInput') {
      res.json({ success: false, message: 'Please enter valid input.' });
    } else {
      var fish = new Fish();
      if (req.body.type && req.body.type != null) fish.type = req.body.type;
      if (req.body.lure && req.body.lure != null) fish.lure = req.body.lure;
      if (req.body.description && req.body.description != null) fish.description = req.body.description;
      if (req.body.userId && req.body.userId != null) fish.userId = req.body.userId;
      if (req.file) fish.image = req.file.filename;
      fish.save(function(err) {
        if (err) {
          if (req.file) fs.unlink(req.file.path);
          if (err.errors != null) {
            if (err.errors.type) {
              res.json({ success: false, message: err.errors.type.message });
            } else if (err.errors.lure) {
              res.json({ success: false, message: err.errors.lure.message });
            } else if (err.errors.description) {
              res.json({ success: false, message: err.errors.description.message });
            }
          } else {
            res.json({ success: false, message: 'Unable to save fish.' });
          }
        } else {
          res.json({ success: true, message: 'Fish saved successfully.' });
        }
      });
    }
  });

  router.post('/login', function(req, res) {
    User.findOne({ email: req.body.email }).select('_id email firstName password fbAccount').exec(function(err, user) {
      if (err) throw err;
      if (!user) {
        res.json({ success: false, message: 'Could not authenticate user.' });
      } else if (user) {
        if (req.body.password) {
          var validPassword = user.comparePassword(req.body.password);
          if (!validPassword) {
            res.json({ success: false, message: 'Could not validate password.' });
          } else {
            var token = jwt.sign({ id: user._id, email: user.email, fbAccount: user.fbAccount, name: user.firstName }, secret, { expiresIn: '24h' });
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
