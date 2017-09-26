import { get as configGet } from 'config';
import { ExtractJwt, Strategy as JwtStrategy, StrategyOptions as jwtOptions, VerifiedCallback } from 'passport-jwt';
import { Strategy as LocalStrategy, IStrategyOptions as localOptions } from 'passport-local';
import { User, user } from '../models/user';
import { use as passportUse, authenticate,  } from 'passport';
import { Handler } from 'express';

// JwtStrategy = require('passport-jwt').Strategy,
// ExtractJwt = require('passport-jwt').ExtractJwt,
// LocalStrategy = require('passport-local');

const localOptions: localOptions = {
  usernameField: 'username'
};
// Setting JWT strategy options
const jwtOptions: jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Tell Passport to check auth headers for JWT
  secretOrKey: configGet('secret') // Tell Passport where to find the secret
  // TO-DO: Add issuer and audience checks
};

export class PassportConfig {
  public static requireLogin: Handler;
  public static requireAuth: Handler;
  public static requireAccess: Handler;

  public static initiate() {
    // apply passport settings
    passportUse('requireAuth', fullAuth);
    passportUse('requireAccess', cmsAccessAuth);
    passportUse(localLogin);

    this.requireLogin   = authenticate('local',           { session: false });
    this.requireAuth    = authenticate('requireAuth',     { session: false });
    this.requireAccess  = authenticate('requireAccess',   { session: false });

    console.log('[PassportConfig] completed');
  }
}



// Setting up local login strategy
const localLogin = new LocalStrategy(localOptions, (username, password, done) => {
  User.findOne({ username_lower: username.toLowerCase() }, (err, user) => {
    if (err) { return done(err); }

    if (!user) { return done(null, false); }

    user.comparePassword(password, (err2, isMatch) => {
      if (err2) { return done(err2); }
      if (!isMatch) { return done(null, false);
      }

      return done(null, user);
    });
  });
});



// Setting up JWT login strategies
const fullAuth = new JwtStrategy(jwtOptions, function(payload: any, done: VerifiedCallback): void {
  User.findById(payload._id, function(err: Error, user: user) {
    if (err) { return done(err, false); }

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});
const cmsAccessAuth = new JwtStrategy(jwtOptions, function(payload: any, done: VerifiedCallback) {
  console.log(payload);
  // returns true regardless; supplies the user if it exists.
  // Its up to the CONTROLLER to handle access!!
  User.findById(payload._id, function(err: Error, user: user) {
    if (err) { return done(null, true); }
    if (user) { done(null, user); } else { done(null, true); }
  });
});
