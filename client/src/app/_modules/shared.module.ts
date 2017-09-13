import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// services
import { AuthService } from '../_services/auth.service';
import { CMSService } from '../_services/cms.service';

// Modules
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
// import { MaterialModule } from '@angular/material'; <- depricated
import { MaterialModule } from './material.module';
import { DateFnsModule } from 'ngx-date-fns';


// Pipes
import { KeysPipe } from '../_pipes/keys.pipe';
// import { DatePipe } from '@angular/common';

// Guards
import { AuthGuard } from '../_guards/auth.guard';



@NgModule({
  declarations: [
    KeysPipe,
  ],
  providers: [
    AuthService,
    CMSService,
    AuthGuard
  ],
  exports: [
    CommonModule,
    KeysPipe,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    DateFnsModule
  ]
})
export class SharedModule { }
