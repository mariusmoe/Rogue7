import { Request, Response, NextFunction } from 'express';
import { msg } from '../libs/responseMessage';


export class ErrorController {

  /**
   * Returns 404 with a route invalid message
   * @param  {Request}      req  request
   * @param  {Response}     res  response
   * @param  {NextFunction} next next
   * @return {Response}          server response: route invalid
   */
  public static error(req: Request, res: Response, next: NextFunction) {
    return res.status(404).send(msg('ROUTE_INVALID'));
  }
}
