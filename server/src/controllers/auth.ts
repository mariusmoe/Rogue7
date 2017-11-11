import { Request, Response, NextFunction } from 'express';
import { isEmpty } from 'validator';
import { User, user } from '../models/user';
import { get as configGet } from 'config';
import { status, ROUTE_STATUS, AUTH_STATUS } from '../libs/responseMessage';
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
    let user = <user>{ _id: req.user._id, username: req.user.username, role: req.user.role };
    return res.status(200).json({
      token: 'bearer ' + sign(user, configGet<string>('secret'), { expiresIn: 10800 }), // expiresIn in seconds ( = 3hours)
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
          role            = <string>req.body.role,
          username        = <string>req.body.username;

    if (isEmpty(username) || isEmpty(password)) {
      return res.status(400).send(status(AUTH_STATUS.NO_USERNAME_OR_PASSWORD));
    }
    if (isEmpty(role) || (userTypes.indexOf(role) === -1) ) {
      return res.status(400).send(status(AUTH_STATUS.NO_OR_BAD_ROLE));
    }

    User.findOne({ username_lower: username.toLowerCase() }, (err1, userAlreadyExists) => {
      if (err1) { return next(err1); }

      // check if the email is already in use first
      if (userAlreadyExists) {
        return res.status(409).send(status(AUTH_STATUS.USERNAME_NOT_AVILIABLE));
      }

      let user = new User({
        username:   username,
        username_lower: username.toLowerCase(),
        password:   password,
        role:       role,
      }).save((err2, newUser) => {
        if (err2) { return next(err2); }
        return res.status(200).send(status(AUTH_STATUS.ACCOUNT_CREATED));
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
      return res.status(400).send(status(AUTH_STATUS.NO_PASSWORD_OR_NEW_PASSWORDS));
    }

    if (password !== confirm) {
      return res.status(400).send(status(AUTH_STATUS.PASSWORD_AND_CONFIRM_NOT_EQUAL));
    }

    user.comparePassword(currentPassword, (x, isMatch) => {
      if (!isMatch) {
        return res.status(400).send(status(AUTH_STATUS.PASSWORD_DID_NOT_MATCH));
      }
      user.password = password;
      user.save((err2, updatedUser) => {
        if (err2) { next(err2); }

        return res.status(200).send(status(AUTH_STATUS.PASSWORD_UPDATED));
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
      return res.status(401).send(status(ROUTE_STATUS.UNAUTHORISED));
    }
    if (!id) {
      return res.status(400).send(status(AUTH_STATUS.USER_ID_NOT_FOUND));
    }
    User.findByIdAndRemove(id, (err) => {
      if (err) { return next(err); }
      return res.status(200).send(status(AUTH_STATUS.ACCOUNT_DELETED));
    }).lean();
  }
}
