import { Request, Response, NextFunction } from 'express';
import { isEmpty, escape } from 'validator';
import { user } from '../models/user';
import { Content, content } from '../models/content';
// import { get as configGet } from 'config';
import { msg } from '../libs/responseMessage';
import { sanitize } from 'dompurify';


export class CMSController {


  /**
   * Gets all content routes that the user has access to
   * @param  {Request}      req  request
   * @param  {Response}     res  response
   * @param  {NextFunction} next next
   * @return {Response}          server response: the content object
   */
 public static getContentList(req: Request, res: Response, next: NextFunction) {
    const user = <user>req.user;  // undefined as of now.


    const accessRights = ['everyone'];
    if (user) {
      accessRights.push('user');
      if (user.role === 'admin') { accessRights.push('admin'); }
    }

    Content.find({ access: { $in: accessRights }}, { 'title': true, 'route': true, 'access': true }, (err, contentList) => {
      if (err) { next(err); }
      if (!contentList) {
        return res.status(404).send(msg('CMS_NO_ROUTES'));
      }
      return res.status(200).send(contentList);
    }).lean();
  }


  /**
   * Gets content of a given route, declared by the param
   * @param  {Request}      req  request
   * @param  {Response}     res  response
   * @param  {NextFunction} next next
   * @return {Response}          server response: the content object
   */
 public static getContent(req: Request, res: Response, next: NextFunction) {
    const route      = <string>req.params.route,
          user       = <user>req.user; // undefined as of now.

    Content.findOne({ route: route }, (err, content) => {
      if (err) { next(err); }
      if (!content) {
        return res.status(404).send(msg('CMS_CONTENT_NOT_FOUND'));
      }
      let access = content.access === 'everyone' ||
                   (user && user.role === 'admin') ||
                   (user && user.role === content.access);

      if (!access) {
        return res.status(401).send(msg('ROUTE_UNAUTHORISED'));
      }
      return res.status(200).send(content);
    }).lean();
  }





   /**
    * Creates new content
    * @param  {Request}      req  request
    * @param  {Response}     res  response
    * @param  {NextFunction} next next
    * @return {Response}          server response: the content object
    */
  public static createContent(req: Request, res: Response, next: NextFunction) {
    const data = <content>req.body,
          user = <user>req.user;

    if (isEmpty(data.route) || isEmpty(data.content) || isEmpty(data.access) || isEmpty(data.title)) {
        return res.status(422).send(msg('CMS_DATA_UNPROCESSABLE'));
    }
    if (['admin', 'user', 'everyone'].indexOf(data.access) === -1) {
      return res.status(422).send(msg('CMS_DATA_UNPROCESSABLE'));
    }

    // Sanitize
    data.content = sanitize(data.content);
    data.title = sanitize(data.title);
    data.route = escape(data.route).toLowerCase();

    let content = new Content({
      title: data.title,
      route: data.route,
      access: data.access,
      content: data.content,
      createdBy: user._id,
      updatedBy: user._id,
    });
    content.save((err, success) => {
      if (err) { next(err); }
      if (success) {
        return res.status(200).send(success);
      }
      return res.status(500).send(msg('CMS_DATA_UNABLE_TO_SAVE'));
    });
  }




  /**
   * Updates content
   * @param  {Request}      req  request
   * @param  {Response}     res  response
   * @param  {NextFunction} next next
   * @return {Response}          server response: the updated content object
   */
  public static patchContent(req: Request, res: Response, next: NextFunction) {
    const route      = <string>req.params.route,
          data       = <content>req.body,
          user       = <user>req.user;

    if (isEmpty(data.route) || isEmpty(data.content) || isEmpty(data.access) || isEmpty(data.title)) {
        return res.status(422).send(msg('CMS_DATA_UNPROCESSABLE'));
    }

    // Sanitize
    data.content = sanitize(data.content);
    data.title = sanitize(data.title);
    data.route = escape(data.route).toLowerCase();

    Content.findOneAndUpdate({route: route }, { $set: {
      content: data.content,
      title: data.title,
      route: data.route,
      access: data.access,
      updatedBy: user._id,
    }}, { new: true }, (err, content) => {
      if (err) { next(err); }
      if (content) {
        return res.status(200).send(content);
      }
      return res.status(500).send(msg('CMS_DATA_UNABLE_TO_SAVE'));
    });
  }

  /**
   * Deletes content of a given route, declared by the param
   * @param  {Request}      req  request
   * @param  {Response}     res  response
   * @param  {NextFunction} next next
   * @return {Response}          server response: message declaring success or failure
   */
  public static deleteContent(req: Request, res: Response, next: NextFunction) {
    const route = <string>req.params.route;

    Content.remove({route: route}, (err) => {
      if (err) { next(err); }
      return res.status(200).send(msg('CMS_CONTENT_DELETED'));
      // return res.status(404).send(msg('CMS_CONTENT_NOT_FOUND'));
    });
  }


}
