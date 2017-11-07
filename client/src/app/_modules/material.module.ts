import { NgModule } from '@angular/core';

// Modules
import {
  MatCardModule,
  MatListModule,
  MatIconModule,
  MatInputModule,
  MatButtonModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatTooltipModule,
  MatToolbarModule,
  MatSnackBarModule,
  MatSidenavModule,
  MatExpansionModule,
  MatSelectModule,
  MatMenuModule,
  MatDialogModule,
  MatAutocompleteModule
} from '@angular/material';




@NgModule({
  exports: [
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatExpansionModule,
    MatSelectModule,
    MatMenuModule,
    MatDialogModule,
    MatAutocompleteModule
  ]
})
export class MaterialModule { }
