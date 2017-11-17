export interface User {
  _id?: string;
  username: string;
  role?: string;
  password?: string;
  exp?: number;
}

export interface UpdatePasswordUser {
  password: string;
  newPassword: string;
  confirm: string;
}

export interface UserToken {
  token: string;
  user?: User;
}
