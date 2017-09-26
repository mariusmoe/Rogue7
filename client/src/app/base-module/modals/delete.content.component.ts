import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { CMSService } from '../../_services/cms.service';
import { Router } from '@angular/router';

import { Modal } from '../../_models/modal';

@Component({
  selector: 'app-delete-modal',
  styleUrls: ['./modal.component.scss'],
  templateUrl: './modal.component.html',
})
export class DeleteContentModalComponent implements Modal {
  proceedColor = 'warn';
  cancelColor = 'accent';

  proceedText = 'Delete';
  cancelText =  'Cancel';

  headerText = ''; // updated below
  bodyText = 'Do you wish to proceed?';

  includeCancel: true;

  constructor(
    public dialogRef: MatDialogRef<DeleteContentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private cmsService: CMSService) {
      this.headerText = 'Delete ' + data.content.title;
  }

  /**
   * Proceeds with the task and closes the modal.
   */
  proceed(): void {
    this.dialogRef.close();
    const sub = this.cmsService.deleteContent(this.data.content.route).subscribe(
      () => {
        sub.unsubscribe();
        this.cmsService.getContentList(true);
        this.router.navigate(['/']);
      }
    );
  }

  /**
   * Closes the modal without proceeding.
   */
  cancel(): void {
    this.dialogRef.close();
  }
}
