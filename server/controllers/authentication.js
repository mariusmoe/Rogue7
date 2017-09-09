"use strict";

const jwt = require('jsonwebtoken'),
      crypto = require('crypto'),
      validator = require('validator'),
      config = require('config'),
      User = require('../models/user'),
      msg = require('../libs/responseMessage');

const userTypes = ['admin', 'member'];

/**
 * getSecureRandomBytes in hex format
 * @return {String} A random string of text
 */
function getSecureRandomBytes() {
    crypto.randomBytes(48, function(err, buffer) {
      if (err) { return next(err); }
      const token = buffer.toString('hex');
    });
}

/**
 * generate a random token
 * @param  {User} user a user object
 * @return {Jwt}      a signed JWT
 */
function generateToken(user) {
  return jwt.sign(user, config.secret, {
    expiresIn: 10080 // in seconds
  });
}


exports.updatepassword = (req, res, next) => {
  const currentPassword = req.body.currentPassword,
        password        = req.body.password,
        confirm         = req.body.confirm,
        user            = req.user;


  if (validator.isEmpty(currentPassword) || validator.isEmpty(password) || validator.isEmpty(confirm)) {
    return res.status(400).send(msg.append('NO_PASSWORD_OR_NEW_PASSWORDS'));
  }

  if (password != confirm) {
    return res.status(400).send(msg.append('PASSWORD_AND_CONFIRM_NOT_EQUAL'));
  }

  user.comparePassword(currentPassword, (x, isMatch) => {
    if (!isMatch) {
      // return res.status(400).send({message: status.PASSWORD_DID_NOT_MATCH.message, status: status.PASSWORD_DID_NOT_MATCH.code });
    }
    user.password = password;
    user.save((err2, updatedUser) => {
      if (err2) { next(err2); }

      return res.status(200).send(msg.append('PASSWORD_UPDATED'));
    });
  });
}

/**
 * Returns a new token for a user in a session which is about to expire, if authorized to do so
 * @return {Object}   response object with new token and user
 */
exports.token = (req, res, next) => {
  let user = { _id: req.user._id, email: req.user.email, role: req.user.role }
  return res.status(200).json({
    token: 'bearer ' + generateToken(user),
    user: user
  });
}

/**
 * Delete one account
 */
exports.deleteAccount = (req, res, next) => {
  let id = req.body.id

  if(req.user.role !== userTypes[0]) {
    return res.status(401).send(msg.append('ROUTE_UNAUTHORISED'))
  }
  if (!id) {
    return res.status(400).send(msg.append('USER_NOT_FOUND'));
  }
  User.findByIdAndRemove(id, (err) => {
    if (err) { return next(err); }
    return res.status(200).send(msg.append('ACCOUNT_DELETED'));
  });
}

/**
 * Log in a user
 *
 * respond with a json object with a Json web token and the user
 */
exports.login = (req, res, next) => {
  let user = { _id: req.user._id, email: req.user.email, role: req.user.role }
  return res.status(200).json({
    token: 'bearer ' + generateToken(user),
    user: user
  });
}

/**
 * Register a new user
 */
exports.register = (req, res, next) => {
  const password        = req.body.password,
        role            = req.body.role;
  let   email           = req.body.email; // must be non-const


  if (validator.isEmpty(email) || validator.isEmpty(password)){
    return res.status(400).send(msg.append('NO_EMAIL_OR_PASSWORD'));
  }
  if (validator.isEmpty(role) || (['admin', 'user'].indexOf(role) == -1) ) {
    return res.status(400).send(msg.append('NO_OR_BAD_ROLE'));
  }

  email = email.toLowerCase(); // use lower case to avoid case sensitivity issues later

  User.findOne({email: email}, (err1, emailAlreadyExisting) => {
    if (err1) { return next(err1); }

    // check if the email is already in use first
    if (emailAlreadyExisting) {
      return res.status(409).send(msg.append('EMAIL_NOT_AVILIABLE'));
    }

    let user = new User({
      email:      email,
      password:   password,
      role:       role,
    });
    user.save((err2, newUser) => {
      if (err2) { return next(err2); }
      return res.status(200).send(msg.append('ACCOUNT_CREATED'));
    });
  }).lean();
}
