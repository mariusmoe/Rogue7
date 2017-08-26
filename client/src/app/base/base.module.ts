import { NgModule } from '@angular/core';

// Router
import { BaseRoutingModule } from './base.routing-module';

// Modules
import { SharedModule } from './../shared.module';

// Components
import { BaseComponent } from './base-component/base.component';
import { HomeComponent } from './home-component/home.component';
import { OutletComponent } from './outlet-component/outlet.component';

// import { LoginComponent } from './admin/login/login.component';

// Services


@NgModule({
  declarations: [
    BaseComponent,
    HomeComponent,
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
