import { NgModule } from '@angular/core';

// Router
import { GameRoutingModule } from './game.routing-module';

// Modules
import { SharedModule } from './../../shared.module';

// Components
import { GameComponent } from './game-component/game.component';

// Services
import { GameService } from '../../_services/game.service';


@NgModule({
  declarations: [
    GameComponent
  ],
  imports: [
    GameRoutingModule,
    SharedModule,
  ],
  entryComponents: [

  ],
  providers: [
    GameService,
  ]
})
export class GameModule { }
