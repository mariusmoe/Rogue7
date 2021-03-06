import { Request, Response, NextFunction } from 'express';
import { status, ROUTE_STATUS } from '../libs/validate';


export class ErrorController {

	/**
	 * Returns 404 with a route invalid message
	 * @param  {Request}      req  request
	 * @param  {Response}     res  response
	 * @param  {NextFunction} next next
	 * @return {Response}          server response: route invalid
	 */
	public static error(req: Request, res: Response, next: NextFunction) {
		return res.status(404).send(status(ROUTE_STATUS.INVALID));
	}
}
