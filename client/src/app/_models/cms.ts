

export interface CmsContent {
  _id?: string;
  title: string;
  access: string;
  route: string;
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
