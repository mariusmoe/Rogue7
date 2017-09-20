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
  MdSelectModule,
  MdMenuModule,
  MdTabsModule


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
    MdExpansionModule,
    MdSelectModule,
    MdMenuModule,
    MdTabsModule
  ]
})
export class MaterialModule { }
