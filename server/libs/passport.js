// from the passport docs
const passport = require('passport'),
      User = require('../models/user'),
      config = require('config'),
      JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt,
      LocalStrategy = require('passport-local');

// Setting username field to email rather than username
const localOptions = {
  usernameField: 'email'
}

// Setting up local login strategy
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
  User.findOne({ email: email.toLowerCase() }, function(err, user) {
    if(err) { return done(err); }
    if(!user) { return done(null, false); }
    user.comparePassword(password, function(err2, isMatch) {
      if (err2) { return done(err2); }
      if (!isMatch) { return done(null, false);
      }

      return done(null, user);
    });
  });
});
// Setting JWT strategy options
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Tell Passport to check auth headers for JWT
  secretOrKey: config.secret // Tell Passport where to find the secret
  // TO-DO: Add issuer and audience checks
};

// Setting up JWT login strategies
const fullAuth = new JwtStrategy(jwtOptions, function(payload, done) {
  User.findById(payload._id, function(err, user) {
    if (err) { return done(err, false); }

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});
jwtOptions.jsonWebTokenOptions = {
  ignoreExpiration: true, ignoreNotBefore: true, 
};
const cmsAccessAuth = new JwtStrategy(jwtOptions, function(payload, done) {
  console.log(payload);
  // returns true regardless; supplies the user if it exists.
  // Its up to the CONTROLLER to handle access!!
  User.findById(payload._id, function(err, user) {
    if (err) { return done(null, true); }
    if (user) { done(null, user); } else { done(null, true); }
  });
});

passport.use('fullAuth', fullAuth);
passport.use('cmsAccessAuth', cmsAccessAuth);
passport.use(localLogin);
