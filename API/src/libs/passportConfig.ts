import { get as configGet } from 'config';
import { ExtractJwt, Strategy as JwtStrategy, StrategyOptions as jwtOptions, VerifiedCallback } from 'passport-jwt';
import { verify } from 'jsonwebtoken';
import { Strategy as LocalStrategy, IStrategyOptions as localOptions } from 'passport-local';
import { UserModel, User } from '../models/user';
import { use as passportUse, authenticate, Strategy } from 'passport';
import { Handler } from 'express';
import { Request, Response, NextFunction } from 'express';

// JwtStrategy = require('passport-jwt').Strategy,
// ExtractJwt = require('passport-jwt').ExtractJwt,
// LocalStrategy = require('passport-local');

const localOptions: localOptions = {
	usernameField: 'username'
};
// Setting JWT strategy options
const jwtOptions: jwtOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Tell Passport to check auth headers for JWT
	secretOrKey: configGet<string>('secret') // Tell Passport where to find the secret
	// TO-DO: Add issuer and audience checks
};

export class PassportConfig {
	public static requireLogin: Handler;
	public static requireAuth: Handler;
	public static configureForUser: Handler;

	public static initiate() {
		// apply passport settings
		passportUse(requireLogin);
		passportUse('requireAuth', requireAuth); // So long you're logged in access will be granted

		this.requireLogin = authenticate('local', { session: false });
		this.requireAuth = authenticate('requireAuth', { session: false });
		this.configureForUser = configureForUser;
	}
}



// Setting up local login strategy
const requireLogin = new LocalStrategy(localOptions, (username, password, done) => {
	UserModel.findOne({ username_lower: username.toLowerCase() }, (err, user) => {
		if (err) { return done(err); }

		if (!user) { return done(null, false); }

		user.comparePassword(password, (err2, isMatch) => {
			if (err2) { return done(err2); }
			if (!isMatch) { return done(null, false); }
			return done(null, user);
		});
	});
});



// Setting up JWT login strategies
const requireAuth = new JwtStrategy(jwtOptions, function (payload: any, done: VerifiedCallback): void {
	UserModel.findById(payload._id, function (err: Error, user: User) {
		if (err) { return done(err, false); }

		if (user) {
			done(null, user);
		} else {
			done(null, false);
		}
	});
});


const configureForUser = (req: Request, res: Response, next: NextFunction) => {
	const token = jwtOptions.jwtFromRequest(req);
	verify(token, jwtOptions.secretOrKey, jwtOptions, (err, tokenPayload: any) => {
		if (err) { return next(); }
		UserModel.findById(tokenPayload._id, (err2, user) => {
			req.user = user;
			next();
		});
	});
};
