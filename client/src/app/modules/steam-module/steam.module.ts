import { NgModule } from '@angular/core';

// Router
import { SteamRoutingModule } from './steam.routing-module';

// Modules
import { SharedModule } from '@app/modules/shared.module';

// Components
import { ServerComponent } from './server-component/server.component';



@NgModule({
  declarations: [
    ServerComponent
  ],
  imports: [
    SteamRoutingModule,
    SharedModule
  ]
})
export class SteamModule { }
