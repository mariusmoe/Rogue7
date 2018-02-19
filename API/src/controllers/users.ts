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
		}).lean().sort('username_lower');
	}

	/**
	 * Sets a user role
	 * @param  {Request}      req  request
	 * @param  {Response}     res  response
	 * @param  {NextFunction} next next
	 */
	public static patchUser(req: Request, res: Response, next: NextFunction) {
		const user = <user>req.body,
			adminUser = <user>req.user,
			routeId = <string>req.params.id;
		
		if (adminUser.role !== accessRoles.admin) {
			return res.status(401).send(status(ROUTE_STATUS.UNAUTHORISED));
		}

		if (!user || !user._id || !user.username || !user.role || !user || routeId !== user._id) {
			return res.status(400).send(status(USERS_STATUS.DATA_UNPROCESSABLE));
		}

		const applyUser: Partial<user> = {
			_id: user._id,
			username: user.username,
			username_lower: user.username.toLowerCase(),
			role: user.role,
		};

		User.findOne({ username_lower: applyUser.username_lower }, (err, foundUser) => {
			if (err || (foundUser && foundUser._id != user._id)) {
				return res.status(400).send(status(USERS_STATUS.USERNAME_NOT_AVILIABLE));
			}

			User.findByIdAndUpdate(user._id, applyUser, (err, updated) => {
				if (err) { return next(err); }
				if (updated) {
					return res.status(200).send(status(USERS_STATUS.USER_ROLE_UPDATED));
				} else { // user obj with bad id
					return res.status(400).send(status(USERS_STATUS.DATA_UNPROCESSABLE));
				}
			});
		}).lean();



	}

}