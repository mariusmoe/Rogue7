import { NgModule } from '@angular/core';

// Router
import { SteamRoutingModule } from './steam.routing-module';

// Modules
import { SharedModule } from '../../_modules/shared.module';

// Components
import { DNLComponent } from './dnl-component/dnl.component';
import { ARKComponent } from './ark-component/ark.component';

// Services
import { SteamService } from '../../_services/steam.service';


@NgModule({
  declarations: [
    DNLComponent,
    ARKComponent,
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
