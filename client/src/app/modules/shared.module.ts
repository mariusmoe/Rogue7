import { NgModule, ModuleWithProviders  } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HTTP_INTERCEPTORS } from '@angular/common/http';

// services
import {
  AuthService,
  CMSService,
  InterceptorService,
  SteamService,
  MobileService,
  TokenService
} from '@app/services';

// Modules
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';

// Guards
import { AuthGuard, AdminGuard } from '@app/guards';

// Pipes
import { TimeAgo } from '@app/pipes';

@NgModule({
  exports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    TimeAgo
  ],
  declarations: [
    TimeAgo
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
        MobileService,
        TokenService,
        AuthGuard,
        AdminGuard
      ]
    };
  }
}
