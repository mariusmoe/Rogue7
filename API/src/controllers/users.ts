import { Request, Response, NextFunction } from 'express';
import { User, user, accessRoles } from '../models/user';
import { get as configGet } from 'config';
import { status, ROUTE_STATUS, USERS_STATUS } from '../libs/responseMessage';

const userTypes: accessRoles[] = [accessRoles.admin, accessRoles.user];



export class UsersController {

	/**
	 * Gets All registered users
	 * @param  {Request}      req  request
	 * @param  {Response}     res  response
	 * @param  {NextFunction} next next
	 */
	public static getAllUsers(req: Request, res: Response, next: NextFunction) {
		User.find({}, { username: 1, role: 1, }, (err, users) => {
			if (err) { return next(err); }
			return res.status(200).send(users);
		}).sort('username_lower').lean();
	}

	/**
	 * Sets a user role
	 * @param  {Request}      req  request
	 * @param  {Response}     res  response
	 * @param  {NextFunction} next next
	 */
	public static setUserRole(req: Request, res: Response, next: NextFunction) {
		const changingUser = <user>req.body.user,
			newRole = <accessRoles>req.body.role,
			user = <user>req.user;

		if (user.role !== accessRoles.admin) {
			return res.status(401).send(status(ROUTE_STATUS.UNAUTHORISED));
		}

		if (!changingUser || !newRole) {
			return res.status(400).send(status(USERS_STATUS.DATA_UNPROCESSABLE));
		}

		User.updateOne({ _id: changingUser._id }, { $set: { role: newRole } }, (err, updated) => {
			if (err) { return next(err); }
			if (updated) {
				return res.status(200).send(status(USERS_STATUS.USER_ROLE_UPDATED));
			} else { // user obj with bad id
				return res.status(400).send(status(USERS_STATUS.DATA_UNPROCESSABLE));
			}
		}).lean();


	}

}