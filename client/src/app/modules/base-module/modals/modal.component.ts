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

	constructor(
		public dialogRef: MatDialogRef<ModalComponent>,
		@Inject(MAT_DIALOG_DATA) public data: ModalData) {


		dialogRef.afterClosed().subscribe(proceeding => {
			if (proceeding) {
				this.data.proceed();
			} else {
				if (this.data.includeCancel) {
					this.data.cancel();
				}
			}
		});
	}

	/**
	 * Proceeds with the task and closes the modal.
	 */
	proceed(): void {
		this.dialogRef.close(true);
	}

	/**
	 * Closes the modal without proceeding.
	 */
	cancel(): void {
		this.dialogRef.close(false);
	}
}
