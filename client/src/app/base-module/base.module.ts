import { NgModule } from '@angular/core';

// Router
import { BaseRoutingModule } from './base.routing-module';

// Modules
import { SharedModule } from '../_modules/shared.module';

// Components
import { BaseComponent } from './base-component/base.component';
import { LoginComponent } from './login-component/login.component';
import { UserComponent } from './user-component/user.component';
import { FooterComponent } from './footer-component/footer.component';

import { ContentComponent } from './content-component/content.component';
import { OutletComponent } from './outlet-component/outlet.component';

import { MATERIAL_COMPATIBILITY_MODE } from '@angular/material';


@NgModule({
  declarations: [
    BaseComponent,
    LoginComponent,
    UserComponent,
    FooterComponent,
    ContentComponent,
    OutletComponent
  ],
  imports: [
    SharedModule.forRoot(),
    BaseRoutingModule,
  ],
  entryComponents: [
  ],
  providers: [
    { provide: MATERIAL_COMPATIBILITY_MODE, useValue: true } // forces "mat" instead of "md"
  ]
})
export class BaseModule { }
