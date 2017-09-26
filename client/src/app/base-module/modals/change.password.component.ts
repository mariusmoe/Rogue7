import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Modal } from '../../_models/modal';

@Component({
  selector: 'app-delete-modal',
  styleUrls: ['./modal.component.scss'],
  templateUrl: './modal.component.html',
})
export class ChangePasswordModalComponent implements Modal {

  proceedColor = 'primary';
  proceedText = 'Okay';

  headerText = 'Password updated!';
  bodyText = 'Your password was successfully updated.';

  includeCancel: false;

  constructor(public dialogRef: MatDialogRef<ChangePasswordModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      if (data.failure) {
        this.headerText = 'Failure';
        this.bodyText = 'Could not update your password.';
      }
  }

  /**
   * Proceeds with the task and closes the modal.
   */
  proceed(): void {
    this.dialogRef.close();
  }
}
