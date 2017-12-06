import { NgModule } from '@angular/core';

// Modules (COMMON)
import {
  MatSnackBarModule,
  MatCardModule,
  MatListModule,
  MatIconModule,
  MatInputModule,
  MatButtonModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatTooltipModule,
  MatSidenavModule,
  MatDialogModule,
  MatMenuModule
} from '@angular/material';




@NgModule({
  exports: [
    MatSnackBarModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSidenavModule,
    MatDialogModule,
    MatMenuModule
  ]
})
export class MaterialModule { }
