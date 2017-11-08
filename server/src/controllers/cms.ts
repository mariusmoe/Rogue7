import { Request, Response, NextFunction } from 'express';
import { user } from '../models/user';
import { Content, content } from '../models/content';
import { msg } from '../libs/responseMessage';
import { escape } from 'validator';
import { sanitize } from '../libs/sanitizer';


export class CMSController {


  /**
   * Gets all content routes that the user has access to
   * @param  {Request}      req  request
   * @param  {Response}     res  response
   * @param  {NextFunction} next next
   * @return {Response}          server response: a list of partial content information
   */
 public static getContentList(req: Request, res: Response, next: NextFunction) {
    const user = <user>req.user;  // undefined as of now.


    const accessRights = ['everyone'];
    if (user) {
      accessRights.push('user');
      if (user.role === 'admin') { accessRights.push('admin'); }
    }

    Content.find({ access: { $in: accessRights }}, { 'title': true, 'route': true, 'access': true, 'folder': true }, (err, contentList) => {
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

    if (!data || !data.route || !data.content || !data.access || !data.title) {
        return res.status(422).send(msg('CMS_DATA_UNPROCESSABLE'));
    }
    if (['admin', 'user', 'everyone'].indexOf(data.access) === -1) {
      return res.status(422).send(msg('CMS_DATA_UNPROCESSABLE'));
    }

    // insert ONLY sanitized and escaped data!
    const content = new Content({
      title: escape(data.title),
      route: escape(data.route.replace(/\//g, '')).toLowerCase(),
      access: data.access,
      content: sanitize(data.content),
      createdBy: user._id,
      updatedBy: user._id,
    });
    if (data.folder) { content.folder = escape(data.folder).replace(/\//g, ''); }

    content.save((err, success) => {
      // if (err) { next(err); }
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

    if (!data || !data.route || !data.content || !data.access || !data.title) {
        return res.status(422).send(msg('CMS_DATA_UNPROCESSABLE'));
    }

    // insert ONLY sanitized and escaped data!
    Content.findOneAndUpdate({route: route }, { $set: {
      title: escape(data.title),
      route: escape(data.route.replace(/\//g, '')).toLowerCase(),
      access: data.access,
      content: sanitize(data.content),
      folder: data.folder ? escape(data.folder).replace(/\//g, '') : '',
      updatedBy: user._id,
    }}, { new: true }, (err, content) => {
      // if (err) { next(err); }
      if (content) {
        return res.status(200).send(content);
      }
      return res.status(500).send(msg('CMS_DATA_UNABLE_TO_SAVE'));
    }).lean();
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
      // if (err) { next(err); }
      if (err) { return res.status(404).send(msg('CMS_CONTENT_NOT_FOUND')); }
      return res.status(200).send(msg('CMS_CONTENT_DELETED'));
    }).lean();
  }


}
