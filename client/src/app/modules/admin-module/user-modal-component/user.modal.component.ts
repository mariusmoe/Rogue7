import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSelectChange } from '@angular/material';
import { Router } from '@angular/router';

import { CMSService, AdminService, AuthService } from '@app/services';
import { User, AccessRoles, CmsAccess } from '@app/models';

@Component({
	selector: 'app-user-modal',
	styleUrls: ['./user.modal.component.scss'],
	templateUrl: './user.modal.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserModalComponent {

	public accessChoices: CmsAccess[] = [
		{ value: AccessRoles.user, verbose: 'User', icon: 'verified_user' },
		{ value: AccessRoles.admin, verbose: 'Admin', icon: 'security' }
	];



	constructor(
		public dialogRef: MatDialogRef<UserModalComponent>,
		private adminService: AdminService,
		public authService: AuthService,
		@Inject(MAT_DIALOG_DATA) public data: UserModalData) {

	}

	/**
	 * Proceeds with the task and closes the modal.
	 */
	save(): void {
		this.dialogRef.close(true);
	}

	/**
	 * Closes the modal without proceeding.
	 */
	close(): void {
		this.dialogRef.close(false);
	}



	public updateUserRights(user: User, e: MatSelectChange) {
		this.adminService.setUserRole(user, e.value).subscribe(result => {
		})
	}


}


export interface UserModalData {
	user: User;
}
