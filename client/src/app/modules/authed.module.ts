import { NgModule } from '@angular/core';

// Modules
import {
  MatAutocompleteModule,
  MatExpansionModule,
  MatSelectModule,
  MatCheckboxModule
} from '@angular/material';


@NgModule({
  exports: [
    MatAutocompleteModule,
    MatExpansionModule,
    MatSelectModule,
    MatCheckboxModule
  ]
})
export class AuthedModule { }
