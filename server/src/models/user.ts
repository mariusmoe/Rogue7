import { Document, model, Model, Schema } from 'mongoose';
import * as bcrypt from 'bcrypt-nodejs';
import { NextFunction } from 'express';

const SALT_FACTOR = 10;

/*
 |--------------------------------------------------------------------------
 | User schema
 |--------------------------------------------------------------------------
*/
const schema = new Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },
  password: {
    // Not in clear text
    type: String,
    required: true
  },
  role: { type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
});

export interface user extends Document {
  email: string;
  password: string;
  role: string;
  comparePassword: (candidatePassword: string, cb: (err: Error, isMatch?: boolean) => void ) => null;
}


// Before saving do the following
schema.pre('save', function(next: NextFunction) {
  const user: user = this;
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

// Compare password
schema.methods.comparePassword = function(candidatePassword: string, cb: (err: Error, isMatch?: boolean) => void) {
  const user: user = this;
  bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
    if (err) { return cb(err); }

    cb(null, isMatch);
  });
};


export let User = model<user>('User', schema);
