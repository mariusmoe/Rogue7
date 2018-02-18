import { Document, model, Model, Schema } from 'mongoose';
import { hash, compare } from 'bcrypt';
import { NextFunction } from 'express';

const SALT_FACTOR = 11;

/*
 |--------------------------------------------------------------------------
 | User schema
 |--------------------------------------------------------------------------
*/

export enum accessRoles {
  admin = 'admin',
  user = 'user',
  everyone = 'everyone'
}


const schema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  username_lower: {
    type: String,
    unique: true,
    required: true,
    index: { unique: true }
  },
  password: {
    type: String, // Not in clear text
    required: true
  },
  role: { type: String,
    enum: [accessRoles.admin, accessRoles.user],
    default: accessRoles.user
  },
});

export interface user extends Document {
  username: string;
  username_lower: string;
  password: string;
  role: accessRoles.admin | accessRoles.user;
  comparePassword: (candidatePassword: string, cb: (err: Error, isMatch?: boolean) => void ) => null;
}


// Before saving do the following
schema.pre('save', function(next: NextFunction) {
  const user: user = this;
  if (!user.isModified('password')) { return next(); }
  hash(user.password, SALT_FACTOR, (err, hashed) => {
    if (err) { return next(err); }
    user.password = hashed;
    next();
  });
});

// Compare password
schema.methods.comparePassword = function(candidatePassword: string, cb: (err: Error, isMatch?: boolean) => void) {
  const user: user = this;
  compare(candidatePassword, user.password, (err, isMatch) => {
    if (err) { return cb(err); }

    cb(null, isMatch);
  });
};


export let User = model<user>('User', schema);
