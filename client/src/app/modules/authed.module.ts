import { NgModule } from '@angular/core';

// Modules
import {
  MatAutocompleteModule,
  MatExpansionModule,
  MatSelectModule
} from '@angular/material';


@NgModule({
  exports: [
    MatAutocompleteModule,
    MatExpansionModule,
    MatSelectModule
  ]
})
export class AuthedModule { }
