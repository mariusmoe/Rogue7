import { NgModule } from '@angular/core';

// Router
import { BaseRoutingModule } from './base.routing-module';

// Modules
import { SharedModule } from '@app/modules/shared.module';

// Components
import { BaseComponent } from './base-component/base.component';
import { LoginComponent } from './login-component/login.component';
import { ControlPanelComponent } from './control-panel-component/control.panel.component';
import { FooterComponent } from './footer-component/footer.component';
import { ContentComponent } from './content-component/content.component';
import { NavComponent } from './nav-component/nav.component';
import { SearchComponent } from './search-component/search.component';
import { ModalComponent } from './modals/modal.component';

// CMS resoler
import { CmsResolver } from '@app/guards';


@NgModule({
  declarations: [
    BaseComponent,
    LoginComponent,
    ControlPanelComponent,
    FooterComponent,
    ContentComponent,
    NavComponent,
    SearchComponent,
    ModalComponent
  ],
  imports: [
    BaseRoutingModule,
    SharedModule.forRoot()
  ],
  entryComponents: [
    ModalComponent
  ],
  providers: [
    CmsResolver
  ]
})
export class BaseModule { }
