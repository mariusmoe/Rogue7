import { NgModule } from '@angular/core';

// Modules
import {
	MatSnackBarModule,
	// MatCardModule,
	MatListModule,
	MatIconModule,
	MatProgressBarModule,
	MatTooltipModule,
	MatSidenavModule,
	MatMenuModule,
	MatPaginatorModule,
	MatInputModule,
	MatButtonModule,
	MatDialogModule,
	MatTableModule,
	MatSortModule
} from '@angular/material';




@NgModule({
	exports: [
		MatSnackBarModule,
		// MatCardModule,
		MatListModule,
		MatIconModule,
		MatProgressBarModule,
		MatTooltipModule,
		MatSidenavModule,
		MatMenuModule,
		MatPaginatorModule,
		MatInputModule,
		MatButtonModule,
		MatDialogModule,
		MatTableModule,
		MatSortModule
	]
})
export class MaterialModule { }
