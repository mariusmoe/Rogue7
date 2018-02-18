export interface User {
	_id?: string;
	username: string;
	role?: AccessRoles.user | AccessRoles.admin;
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

export enum AccessRoles {
	admin = 'admin',
	user = 'user',
	everyone = 'everyone'
}
