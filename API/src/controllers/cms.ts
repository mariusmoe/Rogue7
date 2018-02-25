import { Request, Response, NextFunction } from 'express';
import { user, accessRoles } from '../models/user';
import { Content, content } from '../models/content';
import { status, ROUTE_STATUS, CMS_STATUS } from '../libs/responseMessage';
import { escape, isURL } from 'validator';
import { sanitize, stripHTML } from '../libs/sanitizer';


export class CMSController {

	private static ImageSrcRegex = /<img[^>]*src="([^"]*)"/g;

	/**
	 * Retrieves the src of the first image if found.
	 * @param html
	 */
	private static getImageSrcFromContent(html: string): string {
		// entire match, grouping, index, entire input
		const match = CMSController.ImageSrcRegex.exec(html);
		return match ? match[1] : undefined;
	}


	/**
	 * Gets all content routes that the user has access to
	 * @param  {Request}      req  request
	 * @param  {Response}     res  response
	 * @param  {NextFunction} next next
	 * @return {Response}          server response: a list of partial content information
	 */
	public static getContentList(req: Request, res: Response, next: NextFunction) {
		const user = <user>req.user;

		const accessRights: accessRoles[] = [accessRoles.everyone];
		if (user) {
			accessRights.push(accessRoles.user);
			if (user.role === accessRoles.admin) { accessRights.push(accessRoles.admin); }
		}

		Content.aggregate(
			[
				{ $match: { 'current.access': { $in: accessRights } } },
				{ $replaceRoot: { newRoot: "$current" } },
				{ $project: { title: 1, route: 1, access: 1, folder: 1, description: 1, nav: 1 } }
			],
			(err: any, contentList: content[]) => {
				if (err) { next(err); }
				if (!contentList) {
					return res.status(404).send(status(CMS_STATUS.NO_ROUTES));
				}
				return res.status(200).send(contentList);
			}
		);
	}


	/**
	 * Gets content of a given route, declared by the param
	 * @param  {Request}      req  request
	 * @param  {Response}     res  response
	 * @param  {NextFunction} next next
	 * @return {Response}          server response: the content object
	 */
	public static getContent(req: Request, res: Response, next: NextFunction) {
		const route = <string>req.params.route,
			user = <user>req.user;

		Content.findOne({ 'current.route': route }, {
			'current.content_searchable': false, prev: false
		}, (err, contentDoc) => {
			//if (err) { next(err); }
			if (!contentDoc) {
				return res.status(404).send(status(CMS_STATUS.CONTENT_NOT_FOUND));
			}
			const access = contentDoc.current.access === accessRoles.everyone ||
				(user && user.role === accessRoles.admin) ||
				(user && user.role === contentDoc.current.access);

			if (!access) {
				return res.status(401).send(status(ROUTE_STATUS.UNAUTHORISED));
			}
			return res.status(200).send(contentDoc.current);
		}).lean();
	}



	/**
	 * Gets content history of a given route
	 * @param  {Request}      req  request
	 * @param  {Response}     res  response
	 * @param  {NextFunction} next next
	 * @return {Response}          server response: the content history array
	 */
	public static getContentHistory(req: Request, res: Response, next: NextFunction) {
		const route = <string>req.params.route,
			user = <user>req.user;

		if (user.role !== accessRoles.admin) {
			return res.status(401).send(status(ROUTE_STATUS.UNAUTHORISED));
		}

		Content.findOne({ 'current.route': route }, {
			current: true, prev: true
		}, (err, contentDoc) => {
			if (!contentDoc) {
				return res.status(404).send(status(CMS_STATUS.CONTENT_NOT_FOUND));
			}
			return res.status(200).send(contentDoc.prev);
		});
	}




	/**
	 * Creates new content
	 * @param  {Request}      req  request
	 * @param  {Response}     res  response
	 * @param  {NextFunction} next next
	 * @return {Response}          server response: the contentDoc.current object
	 */
	public static createContent(req: Request, res: Response, next: NextFunction) {
		const data = <content>req.body,
			user = <user>req.user;

		if (!data || !data.route || !data.content || !data.access || !data.title) {
			return res.status(422).send(status(CMS_STATUS.DATA_UNPROCESSABLE));
		}
		if ([accessRoles.admin, accessRoles.user, accessRoles.everyone].indexOf(data.access) === -1) {
			return res.status(422).send(status(CMS_STATUS.DATA_UNPROCESSABLE));
		}

		// insert ONLY sanitized and escaped data!
		const sanitizedContent = sanitize(data.content);
		const newCurrent: content = {
			title: escape(data.title),
			route: escape(data.route.replace(/\//g, '')).toLowerCase(),
			access: data.access,
			version: 0,
			content: sanitizedContent,
			content_searchable: stripHTML(data.content),
			description: sanitize(data.description),
			image: CMSController.getImageSrcFromContent(sanitizedContent),
			nav: !!data.nav,
			createdBy: user._id,
			updatedBy: user._id,
			updatedAt: new Date(),
			createdAt: new Date()
		};
		if (data.folder) { newCurrent.folder = stripHTML(data.folder).replace(/\//g, ''); }

		new Content({ current: newCurrent }).save((err, newContentDoc) => {
			console.log(err);
			if (!newContentDoc) { return res.status(500).send(status(CMS_STATUS.DATA_UNABLE_TO_SAVE)); }
			return res.status(200).send(newContentDoc.current);

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
		const route = <string>req.params.route,
			data = <content>req.body,
			user = <user>req.user;

		if (!data || !data.route || !data.content || !data.access || !data.title) {
			return res.status(422).send(status(CMS_STATUS.DATA_UNPROCESSABLE));
		}

		// Fetch current version
		Content.findOne({ 'current.route': route }, { prev: false }, (err, contentDoc) => {
			if (!contentDoc) {
				return res.status(404).send(status(CMS_STATUS.CONTENT_NOT_FOUND));
			}

			const sanitizedContent = sanitize(data.content);
			const patched = {
				title: escape(data.title),
				route: escape(data.route.replace(/\//g, '')).toLowerCase(),
				access: data.access,
				version: contentDoc.current.version + 1,
				content: sanitizedContent,
				content_searchable: stripHTML(data.content),
				description: sanitize(data.description),
				image: CMSController.getImageSrcFromContent(sanitizedContent),
				nav: !!data.nav,
				folder: data.folder ? stripHTML(data.folder).replace(/\//g, '') : '',
				updatedBy: user._id,
				updatedAt: new Date(),
				createdBy: contentDoc.current.createdBy,
				createdAt: contentDoc.current.createdAt
			};

			Content.findByIdAndUpdate(
				contentDoc._id,
				{
					$set: { current: patched },
					$push: { prev: { $each: [contentDoc.current], $position: 0, $slice: 10 } }
				},
				{ new: true },
				(err2, updated) => {
					console.log(err2);
					if (!updated) { return res.status(500).send(status(CMS_STATUS.DATA_UNABLE_TO_SAVE)); }
					return res.status(200).send(updated.current);
				}
			);
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

		Content.remove({ 'current.route': route }, (err) => {
			// if (err) { next(err); }
			if (err) { return res.status(404).send(status(CMS_STATUS.CONTENT_NOT_FOUND)); }
			return res.status(200).send(status(CMS_STATUS.CONTENT_DELETED));
		}).lean();
	}



	/**
	 * Returns search results for a given search term provided in the body
	 * @param  {Request}      req  request
	 * @param  {Response}     res  response
	 * @param  {NextFunction} next next
	 * @return {Response}          server response: the search results
	 */
	public static searchContent(req: Request, res: Response, next: NextFunction) {
		const searchTerm = <string>req.params.searchTerm || '',
			user = <user>req.user;

		const accessRights: accessRoles[] = [accessRoles.everyone];
		if (user) {
			accessRights.push(accessRoles.user);
			if (user.role === accessRoles.admin) { accessRights.push(accessRoles.admin); }
		}

		Content.find(
			{ $text: { $search: searchTerm }, 'current.access': { $in: accessRights } },
			{
				'current.title': 1, 'current.route': 1, 'current.folder': 1, 'current.description': 1,
				'current.image': 1, 'relevance': { $meta: 'textScore' }
			},
			(err, contentList) => {
				if (err) { return res.status(404).send(status(CMS_STATUS.SEARCH_RESULT_NONE_FOUND)); }

				return res.status(200).send(contentList);
			}
		).sort({ relevance: { $meta: 'textScore' } }).limit(1000).lean();
	}
}
