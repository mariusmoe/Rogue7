export interface User {
    _id?: string;
    email: string;
    role: string;
    password?: string;
}

export interface UpdatePasswordUser {
  password: string;
  newPassword: string;
  confirm: string;
}
