import { AccessRoles } from '@app/models/user';

export interface CmsContent {
	// Always present
	title: string;
	access: AccessRoles;
	route: string;
	version: number;
	// May be present
	folder?: string;
	content?: string;
	nav?: boolean;
	description?: string;
	image?: string;
	// Only present when requesting single content
	createdBy?: string;
	updatedBy?: string;
	createdAt?: Date;
	updatedAt?: Date;
	// Only present for search results
	relevance?: number;
}

export interface CmsAccess {
	verbose: string;
	icon: string;
	value: string;
}

export interface CmsFolder {
	title: string;
	content: CmsContent[];
}
