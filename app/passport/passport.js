var FaceBookStrategy = require('passport-facebook').Strategy;
var User             = require('../models/user');
var session          = require('express-session');
var jwt              = require('jsonwebtoken');
var secret           = '200154321';

module.exports = function(app, passport) {

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }));

  passport.serializeUser(function(user, done) {
    token = jwt.sign({ id: user._id, name: user.firstName }, secret, { expiresIn: '24h' });
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use(new FaceBookStrategy({
    clientID: '1457664190955004',
    clientSecret: '21ba20a81fa3eb5976911441327f90ff',
    callbackURL: 'http://localhost:8080/auth/facebook/callback',
    enableProof: true,
    profileFields: ['id', 'displayName', 'email']
  },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({ email: profile._json.email }).select('firstName password email').exec(function(err, user) {
        if (err) done(err);
        if (user && user != null) {
          done(null, user);
        } else {
          var user = new User();
          user.email = profile._json.email;
          user.firstName = profile.displayName.split(' ')[0];
          user.password = profile._json.id;
          user.save(function(err) {
            if (err) {
              done(err);
            } else {
              done(null, user);
            }
          });
        }
      });
    }
  ));

  app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/facebookerror' }), function(req, res) {
    res.redirect('/facebook/' + token);
  });

  app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

  return passport;
}
