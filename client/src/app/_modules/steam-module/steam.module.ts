import { NgModule } from '@angular/core';

// Router
import { SteamRoutingModule } from './steam.routing-module';

// Modules
import { SharedModule } from '../../_modules/shared.module';

// Components
import { ServerComponent } from './server-component/server.component';

// Services
import { SteamService } from '../../_services/steam.service';


@NgModule({
  declarations: [
    ServerComponent
  ],
  imports: [
    SteamRoutingModule,
    SharedModule,
  ],
  entryComponents: [

  ],
  providers: [
    SteamService,
  ]
})
export class SteamModule { }
