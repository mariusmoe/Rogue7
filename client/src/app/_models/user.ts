export interface User {
    _id?: string;
    username: string;
    role?: string;
    password?: string;
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
