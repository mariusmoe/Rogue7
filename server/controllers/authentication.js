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

/**
 * renew JWT
 * @return {Object}   response object with new token and user
 */
exports.getJWT = (req, res, next) => {
  let user = { _id: req.user._id, email: req.user.email, role: req.user.role }
  res.status(200).json({
    token: 'JWT ' + generateToken(user),
    user: user,
    center: req.user.center
  });
}

/**
 * Delete one account
 */
exports.deleteAccount = (req, res, next) => {
  // let id = req.user._id;
  let id = req.body.id
  if (!id){
    res.status(400).send({message: status.USER_NOT_FOUND.message, status: status.USER_NOT_FOUND.code })
  }
  if(req.user.role === userTypes[0]) {
    User.findByIdAndRemove(id, (err) => {
      if (err) { return next(err); }
      res.status(200).send({message: "deleted user"})
    })
  } else {
    res.status(401).send({message: "unauthorized"})
  }
}

/**
 * Log in a user
 *
 * respond with a json object with a Json web token and the user
 */
exports.login = (req, res, next) => {
  let user = { _id: req.user._id, email: req.user.email, role: req.user.role }
  res.status(200).json({
    token: 'JWT ' + generateToken(user),
    user: user
  });
}

/**
 * Register a new user
 */
exports.register = (req, res, next) => {
  return res.status(200).send({ message: 'TODO' });
}
