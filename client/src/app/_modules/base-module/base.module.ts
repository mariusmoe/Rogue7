import { NgModule } from '@angular/core';

// Router
import { BaseRoutingModule } from './base.routing-module';

// Modules
import { SharedModule } from '../../_modules/shared.module';

// Components
import { BaseComponent } from './base-component/base.component';
import { LoginComponent } from './login-component/login.component';
import { ControlPanelComponent } from './control-panel-component/control.panel.component';
import { UserComponent } from './user-component/user.component';
import { FooterComponent } from './footer-component/footer.component';
import { ContentComponent } from './content-component/content.component';
import { ModalComponent } from './modals/modal.component';

// Services
import { SteamService } from '../../_services/steam.service';

@NgModule({
  declarations: [
    BaseComponent,
    LoginComponent,
    ControlPanelComponent,
    UserComponent,
    FooterComponent,
    ContentComponent,
    ModalComponent,
  ],
  imports: [
    SharedModule.forRoot(),
    BaseRoutingModule,
  ],
  entryComponents: [
    ModalComponent
  ],
  providers: [
    SteamService
  ]
})
export class BaseModule { }
