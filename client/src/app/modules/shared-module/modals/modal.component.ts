import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';

import { CMSService } from '@app/services';
import { ModalData } from '@app/models';

@Component({
	selector: 'delete-modal',
	styleUrls: ['./modal.component.scss'],
	templateUrl: './modal.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent {

	// #region Constructor

	constructor(
		public dialogRef: MatDialogRef<ModalComponent>,
		@Inject(MAT_DIALOG_DATA) public data: ModalData) {

		dialogRef.afterClosed().subscribe(proceeding => {
			if (proceeding) {
				this.data.proceed();
				return;
			}
			if (!!this.data.cancel) { this.data.cancel(); }
		});
	}

	// #endregion

	// #region Methods

	/**
	 * Proceeds with the task and closes the modal.
	 */
	public proceed(): void {
		this.dialogRef.close(true);
	}

	/**
	 * Closes the modal without proceeding.
	 */
	public cancel(): void {
		this.dialogRef.close(false);
	}

	// #endregion
}
