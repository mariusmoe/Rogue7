import { NgModule } from '@angular/core';

// Modules
import {
  MdCardModule,
  MdListModule,
  MdIconModule,
  MdInputModule,
  MdButtonModule,
  MdProgressBarModule,
  MdProgressSpinnerModule,
  MdTooltipModule,
  MdToolbarModule,
  MdSnackBarModule,
  MdSidenavModule,
  MdExpansionModule,


} from '@angular/material';




@NgModule({
  exports: [
    MdCardModule,
    MdListModule,
    MdIconModule,
    MdInputModule,
    MdButtonModule,
    MdProgressBarModule,
    MdProgressSpinnerModule,
    MdTooltipModule,
    MdToolbarModule,
    MdSnackBarModule,
    MdSidenavModule,
    MdExpansionModule
  ]
})
export class MaterialModule { }
