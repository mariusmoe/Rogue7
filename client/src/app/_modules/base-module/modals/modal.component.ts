import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { CMSService } from '../../../_services/cms.service';
import { Router } from '@angular/router';

import { ModalData } from '../../../_models/modalData';

@Component({
  selector: 'app-delete-modal',
  styleUrls: ['./modal.component.scss'],
  templateUrl: './modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent {

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalData) {
  }

  /**
   * Proceeds with the task and closes the modal.
   */
  proceed(): void {
    this.data.proceed();
    this.dialogRef.close();
  }

  /**
   * Closes the modal without proceeding.
   */
  cancel(): void {
    if (this.data.includeCancel) {
      this.data.cancel();
    }
    this.dialogRef.close();
  }
}
