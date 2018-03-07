import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';

import { AdminService, AuthService } from '@app/services';
import { User, AccessRoles, TableSettings, ColumnType, ColumnDir } from '@app/models';

import { UserModalComponent, UserModalData } from '../user-modal-component/user.modal.component';

import { Subject } from 'rxjs/Subject';


@Component({
	selector: 'users-component',
	templateUrl: './users.component.html',
	styleUrls: ['./users.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent {

	public data = new Subject<User[]>();

	public readonly settings: TableSettings = {
		columns: [
			{
				header: 'Username',
				property: 'username',
				sort: true,
			},
			{
				header: 'Role',
				property: 'role',
				sort: true,
				icon: (role: string): string => {
					switch (role) {
						case AccessRoles.admin: { return 'security'; }
						case AccessRoles.user: { return 'verified_user'; }
					}
				},
				displayFormat: (access: AccessRoles): string => {
					switch (access) {
						case AccessRoles.admin: { return 'Admin'; }
						case AccessRoles.user: { return 'User'; }
					}
				},
			},
			{
				header: 'Edit',
				property: '_id',
				sort: false,
				type: ColumnType.Button,
				icon: () => 'settings',
				noText: true,
				func: (property: string, user: User, users: User[]) => {
					this.dialog.open(
						UserModalComponent,
						<MatDialogConfig>{ data: <UserModalData>{ user: user, userList: users } }
					).afterClosed().subscribe((closedResult: boolean) => {
						if (closedResult) { this.updateList(); }
					});
				},
				disabled: (input: any, user: User) => this.authService.isSameUser(user, this.authService.getUser().getValue()),
				narrow: true
			}
		],

		active: 'username',
		dir: ColumnDir.ASC,

		trackBy: (index: number, user: User) => user._id,

		mobile: ['username', 'role', '_id'], // _id = edit

	};


	constructor(
		private dialog: MatDialog,
		public authService: AuthService,
		public adminService: AdminService) {
		this.updateList();
	}

	/**
	 * Updates the user list
	 */
	private updateList() {
		const sub = this.adminService.getAllusers().subscribe(users => {
			this.data.next(users);
			sub.unsubscribe();
		});
	}

}
