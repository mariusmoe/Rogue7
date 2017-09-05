import { NgModule } from '@angular/core';

// Router
import { BaseRoutingModule } from './base.routing-module';

// Modules
import { SharedModule } from '../_modules/shared.module';

// Components
import { BaseComponent } from './base-component/base.component';
import { HomeComponent } from './home-component/home.component';
import { OutletComponent } from './outlet-component/outlet.component';
import { LoginComponent } from './login-component/login.component';
import { UserComponent } from './user-component/user.component';


// Services


@NgModule({
  declarations: [
    BaseComponent,
    HomeComponent,
    OutletComponent,
    LoginComponent,
    UserComponent
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
