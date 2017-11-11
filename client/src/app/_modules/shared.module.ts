import { NgModule, ModuleWithProviders  } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HTTP_INTERCEPTORS } from '@angular/common/http';

// services
import { AuthService } from '../_services/auth.service';
import { CMSService } from '../_services/cms.service';
import { InterceptorService } from '../_services/interceptor.service';
import { SteamService } from '../_services/steam.service';

// Modules
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { DateFnsModule } from 'ngx-date-fns';


// Guards
import { AuthGuard } from '../_guards/auth.guard';



@NgModule({
  declarations: [
  ],
  exports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    DateFnsModule
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: InterceptorService,
          multi: true
        },
        AuthService,
        CMSService,
        SteamService,
        AuthGuard
      ],
    };
  }
}
