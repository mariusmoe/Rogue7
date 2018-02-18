import { NgModule } from '@angular/core';


// Modules
import {
	MatAutocompleteModule,
	MatSelectModule,
	MatCheckboxModule,
	MatExpansionModule,
	MatProgressSpinnerModule,
	MatTabsModule,
} from '@angular/material';




@NgModule({
	exports: [
		MatAutocompleteModule,
		MatSelectModule,
		MatCheckboxModule,
		MatExpansionModule,
		MatProgressSpinnerModule,
		MatTabsModule
	]
})
export class CommonModule { }
