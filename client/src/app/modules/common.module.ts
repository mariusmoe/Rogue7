import { NgModule } from '@angular/core';


// Modules
import {
  MatAutocompleteModule,
  MatSelectModule,
  MatCheckboxModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
} from '@angular/material';




@NgModule({
  exports: [
    // Material
    MatAutocompleteModule,
    MatSelectModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
  ]
})
export class CommonModule { }
