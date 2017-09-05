"use strict";

const jwt = require('jsonwebtoken'),
      crypto = require('crypto'),
      validator = require('validator'),
      config = require('config'),
      User = require('../models/user'),
      status = require('../status');

const userTypes = ['sysadmin', 'user'];

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

exports.roleAuthorization = function(role){
  return function(req,res,next){
    let id = req.user._id;

    User.findById(id, function(err,foundUser){
      if(err){
        res.status(422).json({error: status.USER_NOT_FOUND.message, status: status.USER_NOT_FOUND.code});
        return next(err);
      }
      if(foundUser.role == role){
        return next();
      }
      res.status(401).json({error: 'You are not authorized.'});
      return next('Unauthorized');
    })
  }
}


exports.updatepassword = (req, res, next) => {
  const currentPassword = req.body.currentPassword,
        password        = req.body.password,
        confirm         = req.body.confirm,
        user            = req.user;


  if (validator.isEmpty(currentPassword) || validator.isEmpty(password) || validator.isEmpty(confirm)) {
    return res.status(400).send({message: status.NO_PASSWORD_OR_NEW_PASSWORDS.message, status: status.NO_PASSWORD_OR_NEW_PASSWORDS.code });
  }

  if (password != confirm) {
    return res.status(400).send({message: status.PASSWORD_AND_CONFIRM_NOT_EQUAL.message, status: status.PASSWORD_AND_CONFIRM_NOT_EQUAL.code });
  }

  user.comparePassword(currentPassword, (x, isMatch) => {
    if (!isMatch) {
      // return res.status(400).send({message: status.PASSWORD_DID_NOT_MATCH.message, status: status.PASSWORD_DID_NOT_MATCH.code });
    }
    user.password = password;
    user.save((err2, updatedUser) => {
      if (err2) { next(err2); }
      return res.status(200).send({message: status.PASSWORD_UPDATED.message, status: status.PASSWORD_UPDATED.code });
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
  // let id = req.user._id;
  let id = req.body.id
  if (!id){
    return res.status(400).send({message: status.USER_NOT_FOUND.message, status: status.USER_NOT_FOUND.code })
  }
  if(req.user.role === userTypes[0]) {
    User.findByIdAndRemove(id, (err) => {
      if (err) { return next(err); }
      return res.status(200).send({message: "deleted user"})
    })
  } else {
    return res.status(401).send({message: "unauthorized"})
  }
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
    return res.status(400).send({
      message: status.NO_EMAIL_OR_PASSWORD.message,
      status: status.NO_EMAIL_OR_PASSWORD.code
    });
  }
  if (validator.isEmpty(role) || (['admin', 'user'].indexOf(role) == -1) ) {
    return res.status(400).send({
      message: status.NO_OR_BAD_ROLE.message,
      status: status.NO_OR_BAD_ROLE.code
    });
  }

  email = email.toLowerCase(); // use lower case to avoid case sensitivity issues later

  User.findOne({email: email}, (err1, emailAlreadyExisting) => {
    if (err1) { return next(err1); }

    // check if the email is already in use first
    if (emailAlreadyExisting) {
      return res.status(409).send({ message: status.EMAIL_NOT_AVILIABLE.message, status: status.EMAIL_NOT_AVILIABLE.code });
    }

    let user = new User({
      email:      email,
      password:   password,
      role:       role,
    });
    user.save((err2, newUser) => {
      if (err2) { return next(err2); }
      return res.status(200).send({message: status.ACCOUNT_CREATED.message, status: status.ACCOUNT_CREATED.code} )
    });
  });
}
