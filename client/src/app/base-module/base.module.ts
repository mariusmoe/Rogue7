import { NgModule } from '@angular/core';

// Router
import { BaseRoutingModule } from './base.routing-module';

// Modules
import { SharedModule } from '../_modules/shared.module';

// Components
import { BaseComponent } from './base-component/base.component';
import { LoginComponent } from './login-component/login.component';
import { UserComponent } from './user-component/user.component';

import { CreateComponent } from './cms/create-component/create.component';
import { ContentComponent } from './cms/content-component/content.component';
import { OutletComponent } from './cms/outlet-component/outlet.component';

// Services


@NgModule({
  declarations: [
    BaseComponent,
    LoginComponent,
    UserComponent,
    CreateComponent,
    ContentComponent,
    OutletComponent
  ],
  imports: [
    SharedModule,
    BaseRoutingModule,
  ],
  entryComponents: [
  ],
  providers: [
    // GameService,
  ]
})
export class BaseModule { }
