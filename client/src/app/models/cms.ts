import { AccessRoles } from '@app/models/user';

export interface CmsContent {
  _id?: string;
  title: string;
  access: AccessRoles;
  route: string;
  folder?: string;
  content?: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
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
