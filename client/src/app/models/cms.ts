import { AccessRoles } from '@app/models/user';

export interface CmsContent {
  _id?: string;
  // Always present
  title: string;
  access: AccessRoles;
  route: string;
  // May be present
  folder?: string;
  content?: string;
  // Only present when requesting single content
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  // Only present for search results
  textScore?: number;
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
