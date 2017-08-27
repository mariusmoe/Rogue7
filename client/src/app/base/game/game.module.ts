import { NgModule } from '@angular/core';

// Router
import { GameRoutingModule } from './game.routing-module';

// Modules
import { SharedModule } from './../../shared.module';
import { DateFnsModule } from 'ngx-date-fns';

// Components
import { GameComponent } from './game-component/game.component';

// Services
import { GameService } from '../../_services/game.service';


@NgModule({
  declarations: [
    GameComponent,
  ],
  imports: [
    GameRoutingModule,
    SharedModule,
    DateFnsModule,
  ],
  entryComponents: [

  ],
  providers: [
    GameService,
  ]
})
export class GameModule { }
