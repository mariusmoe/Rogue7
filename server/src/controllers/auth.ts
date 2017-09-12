import { Request, Response, NextFunction } from 'express';
import { isEmpty } from 'validator';
import { User, user } from '../models/user';
import { get as configGet } from 'config';
import { msg } from '../libs/responseMessage';
import { sign } from 'jsonwebtoken';

const userTypes = ['admin', 'member'];

export class AuthController {


   /**
    * Returns a new token for a user in a session which is about to expire, if authorized to do so
    * @param  {Request}      req  request
    * @param  {Response}     res  response
    * @param  {NextFunction} next next
    * @return {Response}          server response: object containing token and user
    */
  public static token(req: Request, res: Response, next: NextFunction) {
    let user = <user>{ _id: req.user._id, email: req.user.email, role: req.user.role };
    return res.status(200).json({
      token: 'bearer ' + sign(user, configGet('secret'), { expiresIn: 10080 }), // expiresIn in seconds
      user: user
    });
  }


  /**
   * Registers a user
   * @param  {Request}      req  request
   * @param  {Response}     res  response
   * @param  {NextFunction} next next
   * @return {Response}          server response
   */
  public static register(req: Request, res: Response, next: NextFunction): Response {
    const password        = <string>req.body.password,
          role            = <string>req.body.role;
    let   email           = <string>req.body.email; // must be non-const

    if (isEmpty(email) || isEmpty(password)) {
      return res.status(400).send(msg('NO_EMAIL_OR_PASSWORD'));
    }
    if (isEmpty(role) || (userTypes.indexOf(role) === -1) ) {
      return res.status(400).send(msg('NO_OR_BAD_ROLE'));
    }

    User.findOne({email: email.toLowerCase() }, (err1, emailAlreadyExisting) => {
      if (err1) { return next(err1); }

      // check if the email is already in use first
      if (emailAlreadyExisting) {
        return res.status(409).send(msg('EMAIL_NOT_AVILIABLE'));
      }

      let user = new User({
        email:      email,
        password:   password,
        role:       role,
      }).save((err2, newUser) => {
        if (err2) { return next(err2); }
        return res.status(200).send(msg('ACCOUNT_CREATED'));
      });
    }).lean();
  }


  /**
   * Updates a user's password based ont he body contents.
   * @param  {Request}      req  request
   * @param  {Response}     res  response
   * @param  {NextFunction} next next
   * @return {Response}          server response:
   */
  public static updatePassword(req: Request, res: Response, next: NextFunction): Response {
    const currentPassword = <string>req.body.currentPassword,
          password        = <string>req.body.password,
          confirm         = <string>req.body.confirm,
          user            = <user>req.user;


    if (isEmpty(currentPassword) || isEmpty(password) || isEmpty(confirm)) {
      return res.status(400).send(msg('NO_PASSWORD_OR_NEW_PASSWORDS'));
    }

    if (password !== confirm) {
      return res.status(400).send(msg('PASSWORD_AND_CONFIRM_NOT_EQUAL'));
    }

    user.comparePassword(currentPassword, (x, isMatch) => {
      if (!isMatch) {
        return res.status(400).send(msg('PASSWORD_DID_NOT_MATCH'));
      }
      user.password = password;
      user.save((err2, updatedUser) => {
        if (err2) { next(err2); }

        return res.status(200).send(msg('PASSWORD_UPDATED'));
      });
    });
  }


  /**
   * Deletes a user-account of a given id from req.body.id
   * @param  {Request}      req  request
   * @param  {Response}     res  response
   * @param  {NextFunction} next next
   * @return {Response}          server response
   */
  public static deleteAccount(req: Request, res: Response, next: NextFunction): Response {
    const id    = <string>req.body.id,
          user  = <user>req.user;

    if (user.role !== userTypes[0]) {
      return res.status(401).send(msg('ROUTE_UNAUTHORISED'));
    }
    if (!id) {
      return res.status(400).send(msg('USER_NOT_FOUND'));
    }
    User.findByIdAndRemove(id, (err) => {
      if (err) { return next(err); }
      return res.status(200).send(msg('ACCOUNT_DELETED'));
    });
  }
}
